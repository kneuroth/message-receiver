import { Update } from './model/Update'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { isValidScoreForToday } from './validation'
import { format, fromUnixTime } from 'date-fns'

import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb'

const AWS = require('aws-sdk')

module.exports.receiveMessage = async (
  req: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!req.body) {
    return {
      statusCode: 400,
      body: 'No body',
    }
  }

  const body = JSON.parse(req.body)
  const updateParse = Update.safeParse(body)

  if (!updateParse.success) {
    console.log('Invalid telegram Update:', req.body)
    console.error('Error:', updateParse.error.issues)

    return {
      statusCode: 400,
      body: 'Invalid telegram Update',
    }
  }

  const update = updateParse.data

  // We have a valid Telegram Update
  // Is it a score?
  let parseScore = isValidScoreForToday(update)

  if (parseScore.valid) {
    // if yes:
    // Attempt write to database
    try {
      const client = new DynamoDBClient({})
      const pk =
        String(update.message.from.id) +
        '_' +
        String(update.message.chat.id) +
        '_' +
        format(fromUnixTime(update.message.date), 'yyyy-MM-dd')
      const input: PutItemCommandInput = {
        TableName: process.env.DYNAMODB_SCORE_TABLE,
        Item: {
          primary_key: { S: pk },
          player_id: { N: String(update.message.from.id) },
          player_name: { S: update.message.from.first_name },
          chat_id: { N: String(update.message.chat.id) },
          score: { N: String(parseScore.score) },
          date: { S: format(new Date(), 'yyyy-MM-dd') },
        },
      }
      const command = new PutItemCommand(input)
      const response = await client.send(command)
    } catch (e) {
      // Handle database write errors
      console.error(e)
    } finally {
      console.log('Wrote successfully')
      {
        return {
          statusCode: 200,
          body: 'Record inserted',
        }
      }
    }
  } else {
    // Not a score.. what should we do?
    console.error(parseScore.reason)
    return {
      statusCode: 200,
      body: parseScore.reason,
    }
  }
}
