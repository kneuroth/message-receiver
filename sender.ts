import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import nodeHtmlToImage from "node-html-to-image";
import { scoreTable } from "./src/db/schema";
import { createHTMLFile } from "./util/file-generation";
import { createHtmlScoreboard } from "./util/html-generation";
import { convertScoresToScoreboards } from "./util/logic";

import fs from 'fs/promises';
import { between } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";
import { format, startOfDay, startOfMonth } from "date-fns";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

module.exports.sendScoreboards = async () => {
  try {
    // Get scores where date is between current start of month and today
    const easternNow = toZonedTime(new Date(), 'America/New_York');
    const today = format(startOfDay(easternNow), 'yyyy-MM-dd');
    const startOfMonthDate = format(startOfMonth(easternNow), 'yyyy-MM-dd');
    const scores = await db.select().from(scoreTable).where(between(scoreTable.date, startOfMonthDate, today));
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