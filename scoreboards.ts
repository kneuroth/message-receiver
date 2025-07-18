import { APIGatewayProxyResult } from 'aws-lambda'
import { convertScoresToScoreboards } from './util/logic'
import { scoreSchema } from './model/Score'

module.exports.getRawScoreboards = async (): Promise<APIGatewayProxyResult> => {

  return {
    statusCode: 200,
    body: 'guh'
  }

}

