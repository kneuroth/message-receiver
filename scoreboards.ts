import { APIGatewayProxyResult } from 'aws-lambda'
import { convertScoresToScoreboards } from './util/logic'
import { scoreTable } from './src/db/schema'
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import fs from 'fs/promises';
import path from 'path';
import { createHTMLFile } from './util/file-generation';
import { createHtmlScoreboard } from './util/html-generation';

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

module.exports.getScoreboardsHtml = async (): Promise<APIGatewayProxyResult> => {

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
      const htmlPath = await createHTMLFile(createHtmlScoreboard(scoreboards));
      return {
        statusCode: 200,
        body: await fs.readFile(htmlPath, 'utf-8'),
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

