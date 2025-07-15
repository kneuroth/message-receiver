import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createInsertSchema } from 'drizzle-zod'

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http';
import { scoreTable } from './src/db/schema'
import { eq } from 'drizzle-orm'
import z from 'zod/v4';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

module.exports.getScores = async (): Promise<APIGatewayProxyResult> => {

  try {
    const scores = await db.select().from(scoreTable);
    return {
      statusCode: 200,
      body: JSON.stringify(scores),
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }
}

module.exports.addScore = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!req.body) {
    return {
      statusCode: 400,
      body: 'No body',
    }
  } else {
    const insertScoreSchema = createInsertSchema(scoreTable);

    const scoreParse = insertScoreSchema.safeParse(JSON.parse(req.body));

    if (!scoreParse.success) {
      console.log('Invalid score insert:', req.body)
      console.error('Error:', scoreParse.error.issues)

      return {
        statusCode: 400,
        body: 'Invalid score object',
      }
    }
    const score = scoreParse.data;

    try {
      const result = await db.insert(scoreTable).values(score);
      return {
        statusCode: 200,
        body: 'OK'
      }
    } catch (e) {
      console.error('Error connecting to database:', e);
      return {
        statusCode: 500,
        body: 'Error connecting to database',
      }
    }
  }
}

module.exports.deleteScore = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!req.pathParameters || !req.pathParameters.id) {
    return {
      statusCode: 400,
      body: 'No primary key provided',
    }
  }
  const pkParse = z.number().safeParse(req.pathParameters.id);
  if (!pkParse.success) {
    return {
      statusCode: 400,
      body: 'Invalid primary key',
    }
  }
  const pk = pkParse.data;
  try {
    const result = await db.delete(scoreTable).where(eq(scoreTable.id, pk));
    return {
      statusCode: 200,
      body: "Deleted score with id: " + pk
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }

}

module.exports.clearScores = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await db.delete(scoreTable);
    return {
      statusCode: 200,
      body: "Cleared scores"
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',

    }
  }
}