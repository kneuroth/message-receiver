import { Update } from './model/Update'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


const AWS = require('aws-sdk')

// Jank af, re-write so that it gets written using the messages API
module.exports.receiveMessage = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

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

  // Attempt write to database
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    const putParams = {
      TableName: process.env.DYNAMODB_SCORE_TABLE,
      Item: {
        primary_key: body.name,
        email: body.email,
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
  }

  return {
    statusCode: 200,
    body: 'Successful process'
  }
}