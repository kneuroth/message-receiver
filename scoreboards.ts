import { APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { convertScoresToScoreboards } from './util/logic'
import { scoreSchema } from './model/Score'

module.exports.getRawScoreboards = async (): Promise<APIGatewayProxyResult> => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_SCORE_TABLE,
  })
  const response = await client.send(command)

  const scoreParse = scoreSchema.array().safeParse(response.Items)
  if (!scoreParse.success) {
    console.error('Invalid scores:', response.Items)
    console.error('Error:', scoreParse.error.issues)
    return {
      statusCode: 400,
      body: 'Invalid score objects',
    }
  }


  return {
    statusCode: 200,
    body: JSON.stringify(convertScoresToScoreboards(scoreParse.data)),
  }

}

