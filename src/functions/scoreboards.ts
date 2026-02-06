import { neon } from '@neondatabase/serverless';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { drizzle } from 'drizzle-orm/neon-http';

import { MATRIX_PNG_SCORE_MAP } from '@constants/png-maps';
import { MATRIX_SCOREBOARD_TEMPLATE } from '@constants/templates/scoreboards/matrix-scoreboard';
import { scoreTable } from '@db/schema';
import { convertScoresToScoreboards } from '@utils/conversions';
import { createHTMLFile } from '@utils/file-generation';
import { createHtmlScoreboard } from '@utils/html-generation';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function getRawScoreboards(): Promise<APIGatewayProxyResult> {

  // get scores from database and then run convertScoresToScoreboards
  try {
    const scores = await db.select().from(scoreTable);
    // TODO: Where clause to filter by month if needed
    if (!scores || scores.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    } else {
      const scoreboards = convertScoresToScoreboards(scores);
      return {
        statusCode: 200,
        body: JSON.stringify(scoreboards),
      }
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }
}

export async function getScoreboardsHtml(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!req.pathParameters || !req.pathParameters.chat_id) {
    return {
      statusCode: 400,
      body: 'No chat_id provided',
    }
  }

  const chatId = req.pathParameters?.chat_id;
  // get scores from database and then run convertScoresToScoreboards
  try {
    const scores = await db.select().from(scoreTable).where(eq(scoreTable.chat_id, Number(chatId)));
    if (!scores || scores.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    } else {
      try {
        const scoreboards = convertScoresToScoreboards(scores);
        const paths = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb, MATRIX_SCOREBOARD_TEMPLATE, MATRIX_PNG_SCORE_MAP), sb.chat_id)));
        const htmlScoreboards = await Promise.all(paths.map(pathResult => fs.readFile(pathResult.path, 'utf-8')));
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
          },
          body: htmlScoreboards.join('\n'),
        }
      } catch (e) {
        console.error('Error creating scoreboards:', e);
        return {
          statusCode: 500,
          body: 'Error creating scoreboards',
        }
      }
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }
}
