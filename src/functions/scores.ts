import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createInsertSchema } from 'drizzle-zod';

import { scoreTable } from '@db/schema';
import { neon } from '@neondatabase/serverless';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import z from 'zod/v4';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function getScores(): Promise<APIGatewayProxyResult> {

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

export async function addScore(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!req.body) {
    return {
      statusCode: 400,
      body: 'No body',
    }
  } else {
    const insertScoreSchema = createInsertSchema(scoreTable).extend({
      player_id: z.preprocess(val => Number(val), z.number()),
      chat_id: z.preprocess(val => Number(val), z.number()),
      score: z.preprocess(val => Number(val), z.number()),
    });

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
      const result = await db.insert(scoreTable).values(score).onConflictDoUpdate({ target: [scoreTable.player_id, scoreTable.chat_id, scoreTable.date], set: { score: score.score } });
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

export async function deleteScore(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!req.queryStringParameters || !req.queryStringParameters.player_id || !req.queryStringParameters.chat_id || !req.queryStringParameters.date) {
    return {
      statusCode: 400,
      body: 'No primary key or partial primary key provided',
    }
  }

  const playerIdParse = z.preprocess(val => Number(val), z.number()).safeParse(req.queryStringParameters.player_id);
  const chatIdParse = z.preprocess(val => Number(val), z.number()).safeParse(req.queryStringParameters.chat_id);

  // Make sure date is YYYY-MM-DD format
  const dateParse = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(req.queryStringParameters.date);

  if (!playerIdParse.success || !chatIdParse.success || !dateParse.success) {
    console.log('player parse', playerIdParse, 'chat parse', chatIdParse, 'date parse', dateParse);
    return {
      statusCode: 400,
      body: 'Invalid primary key',
    }
  }
  const playerId = playerIdParse.data;
  const chatId = chatIdParse.data;
  const date = dateParse.data;
  try {
    const result = await db.delete(scoreTable).where(
      and(
        eq(scoreTable.player_id, playerId),
        eq(scoreTable.chat_id, chatId),
        eq(scoreTable.date, date)
      ));
    return {
      statusCode: 200,
      body: "Deleted score with from player id:" + playerId + " in chat: " + chatId + " on date: " + date
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }

}

export async function clearScores(): Promise<APIGatewayProxyResult> {
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