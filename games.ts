import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyResult } from "aws-lambda"
import { convertScoresToGame } from "./util/convertToGame"

module.exports.getGamesRaw = async (): Promise<APIGatewayProxyResult> => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_SCORE_TABLE,
  })

  const response = await client.send(command)

  //convertScoresToGame(response.Items)

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  }

}