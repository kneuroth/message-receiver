import { Update } from './model/Update'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isValidScoreForToday } from './validation';
import { format } from 'date-fns';


const AWS = require('aws-sdk')

// Jank af, re-write so that it gets written using the messages API
module.exports.receiveMessage = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(req)

  if (!req.body) {
    return {
      statusCode: 400,
      body: 'No body'
    }
  }

  const body = JSON.parse(req.body)
  const updateParse = Update.safeParse(body);

  if (!updateParse.success) {
    console.log("Invalid telegram Update:", req.body)
    console.error("Error:", updateParse.error.issues)

    return {
      statusCode: 400,
      body: 'Invalid telegram Update'
    }
  } 

  const update = updateParse.data;

  // We have a valid Telegram Update
  // Is it a score?
  let parseScore = isValidScoreForToday(update);

  console.log(parseScore)

  if (parseScore.valid) {
    // if yes:
    // Attempt write to database
    try {
      const dynamoDb = new AWS.DynamoDB.DocumentClient()
      console.log('Attempting to write')
      const putParams = {
        TableName: process.env.DYNAMODB_SCORE_TABLE,
        Item: {
          player_id: update.message.from.id,
          player_name: update.message.from.first_name,
          chat_id: update.message.chat.id,
          score: parseScore.score,
          date: format(new Date(), 'yyyy-MM-dd')
        },
      }
      await dynamoDb.put(putParams).promise()
    } catch(e) {
      // Handle database write errors
      console.error(e);
      return {
        statusCode: 500,
        body: 'Error occured in write step:' + e
      }
    } finally {
      console.log("Wrote successfully")
    }
  } else {
    // Not a score.. what should we do?
    return {
      statusCode: 400,
      body: parseScore.reason
    }
  }

  return {
    statusCode: 200,
    body: 'Successful process'
  }
}