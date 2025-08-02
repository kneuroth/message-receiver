import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import nodeHtmlToImage from "node-html-to-image";
import { scoreTable } from "./src/db/schema";
import { createHTMLFile, HTMLCreationResult } from "./util/file-generation";
import { createHtmlScoreboard } from "./util/html-generation";
import { convertScoresToScoreboards } from "./util/logic";
import fs from 'fs/promises';
import { between } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";
import { format, startOfDay, startOfMonth } from "date-fns";
import axios from "axios";
import FormData from "form-data";


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
        const pathResults = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb), sb.chat_id)));
        pathResults.forEach(async (pathResult: HTMLCreationResult) => {
          const htmlBuffer = await fs.readFile(pathResult.path, 'utf-8');
          await nodeHtmlToImage({
            output: './image.png',
            html: htmlBuffer.toString()
          })
          const imageBuffer = await fs.readFile('./image.png')
          // TODO: Envirofy wordle bot id
          const form = new FormData();
          form.append('chat_id', String(pathResult.chatId));
          form.append('photo', imageBuffer, 'image.png');
          axios.post(
            'https://api.telegram.org/bot8195866237:AAF1zEP264bSHtNwy1wqD78w_mkCk41Aa14/sendPhoto',
            form
          )

        })
        return {
          statusCode: 200,
          body: "Scoreboards sent"
        }
      } catch (e) {
        console.error('Error creating scoreboards:',);
        return {
          statusCode: 500,
          body: 'Error creating scoreboards',
        }
      }
    }
  } catch (e) {
    console.error('Error connecting to database:');
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }
}