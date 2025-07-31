import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { convertScoresToScoreboards } from './util/logic'
import { scoreTable } from './src/db/schema'
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import fs from 'fs/promises';
import path from 'path';
import { createHTMLFile } from './util/file-generation';
import { createHtmlScoreboard } from './util/html-generation';
import { eq } from 'drizzle-orm';
import nodeHtmlToImage from 'node-html-to-image';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

module.exports.getRawScoreboards = async (): Promise<APIGatewayProxyResult> => {

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

module.exports.getScoreboardsHtml = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
        const paths = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb))));
        const htmlScoreboards = await Promise.all(paths.map(path => fs.readFile(path, 'utf-8')));
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


// getScoreboardsPng
// For testing png getting
module.exports.getScoreboardsPng = async (req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!req.pathParameters || !req.pathParameters.chat_id) {
    return {
      statusCode: 400,
      body: 'No chat_id provided',
    }
  }
  const chatId = req.pathParameters?.chat_id;
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
        const paths = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb))));
        const htmlScoreboards = await Promise.all(paths.map(path => fs.readFile(path, 'utf-8')));
        await nodeHtmlToImage({
          output: './image.png',
          html: htmlScoreboards.join('\n')
        })
        const imageBuffer = await fs.readFile('./image.png');
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': 'inline; filename="scoreboard.png"',
          },
          isBase64Encoded: true,
          body: imageBuffer.toString('base64')
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
