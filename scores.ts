import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { BatchWriteItemCommand, DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { insertScoreSchema } from './model/Score'

module.exports.getScores = async (): Promise<APIGatewayProxyResult> => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_SCORE_TABLE,
  })

  const response = await client.send(command)
  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  }
}

module.exports.addScore = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!req.body) {
    return {
      statusCode: 400,
      body: 'No body',
    }
  }
  const body = JSON.parse(req.body)
  const insertScoreParse = insertScoreSchema.safeParse(body)

  if (!insertScoreParse.success) {
    console.log('Invalid score insert:', req.body)
    console.error('Error:', insertScoreParse.error.issues)

    return {
      statusCode: 400,
      body: 'Invalid score object',
    }
  }

  const insertScore = insertScoreParse.data;
  // Attempt write to database
  try {
    const client = new DynamoDBClient({})
    const pk =
      String(insertScore.player_id) +
      '_' +
      String(insertScore.chat_id) +
      '_' +
      insertScore.date;
    const input: PutItemCommandInput = {
      TableName: process.env.DYNAMODB_SCORE_TABLE,
      Item: {
        primary_key: { S: pk },
        player_id: { N: String(insertScore.player_id) },
        player_name: { S: insertScore.player_name },
        chat_id: { N: String(insertScore.chat_id) },
        score: { N: String(insertScore.score) },
        date: { S: String(insertScore.date) },
      },
    }
    const command = new PutItemCommand(input)
    const response = await client.send(command)
  } catch (e) {
    // Handle database write errors
    console.error(e)
    return {
      statusCode: 500,
      body: 'Error writing to database',
    }
  } finally {
    console.log('Wrote successfully')
    return {
      statusCode: 200,
      body: 'Record inserted',
    }
  }
}

module.exports.deleteScore = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!req.pathParameters || !req.pathParameters.primary_key) {
    return {
      statusCode: 400,
      body: 'No primary key provided',
    }
  }
  try {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
    const pk = req.pathParameters.primary_key;
    const input: DeleteItemCommandInput = {
      TableName: process.env.DYNAMODB_SCORE_TABLE,
      Key: {
        primary_key: { S: pk },
      },
    }
    const command = new DeleteItemCommand(input);
    const response = await client.send(command)
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: 'Error deleting score',
    }
  } finally {
    console.log('Deleted successfully')
    return {
      statusCode: 200,
      body: 'Deleted score'
    }
  }

}

module.exports.clearScores = async (): Promise<APIGatewayProxyResult> => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_SCORE_TABLE,
  })
  const scanResult = await client.send(command)
  const items = scanResult.Items || [];

  const batches = [];

  for (let i = 0; i < items.length; i += 25) {
    batches.push(items.slice(i, i + 25));
  }

  for (const batch of batches) {
    const deleteRequests = batch.map((item) => ({
      DeleteRequest: {
        Key: {
          primary_key: { S: item.primary_key } // TODO: Make a good primary key schema, reduce logic for inserting
        },
      },
    }));

    await client.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [String(process.env.DYNAMODB_SCORE_TABLE)]: deleteRequests,
        },
      })
    );
  }
  return {
    statusCode: 200,
    body: "Cleared scores"
  }
}