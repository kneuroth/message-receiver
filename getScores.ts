import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

module.exports.getScores = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new ScanCommand({
      
      TableName: process.env.DYNAMODB_SCORE_TABLE,
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response.Items)
    }
}