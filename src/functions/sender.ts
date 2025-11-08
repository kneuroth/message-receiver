import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { scoreTable } from "../db/schema";
import fs from 'fs/promises';
import os from 'os';
import { between } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";
import { format, startOfDay, startOfMonth, subDays } from "date-fns";
import axios from "axios";
import FormData from "form-data";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { convertScoresToScoreboards } from "@utils/conversions";
import { createHTMLFile } from "@utils/file-generation";
import { createHtmlScoreboard } from "@utils/html-generation";
import { lambdaLaunchArgs } from "@utils/browser";
import { CHRISTMAS_SVG_MAP, DEFAULT_SVG_MAP } from "@constants/svg-maps";
import { DEFAULT_SCOREBOARD_TEMPLATE } from "@constants/templates/scoreboards/default-scoreboard";

const fss = require('fs');
const path = require('path');

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function sendScoreboards() {

  console.log("Sending scoreboards...");
  try {
    // Get scores where date is between current start of month and yesterday
    const easternToday = toZonedTime(new Date(), 'America/New_York')
    const easternYesterday = subDays(easternToday, 1);

    const yesterday = format(startOfDay(easternYesterday), 'yyyy-MM-dd');
    const startOfMonthDate = format(startOfMonth(easternYesterday), 'yyyy-MM-dd');

    // Query for scores
    const scores = await db.select().from(scoreTable).where(between(scoreTable.date, startOfMonthDate, yesterday));

    console.log("Scores fetched:", scores.length);
    if (!scores || scores.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    } else {
      try {
        // TODO: Add check if last day of month to create podiums instead
        const scoreboards = convertScoresToScoreboards(scores);

        const pathResults = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb, DEFAULT_SCOREBOARD_TEMPLATE, DEFAULT_SVG_MAP), sb.chat_id)));
        const BOT_TOKEN = process.env.BOT_TOKEN!;

        let browser: any | undefined;
        try {
          const launchArgs = await lambdaLaunchArgs();
          console.log('Launching shared browser with args:', launchArgs.args);
          browser = await puppeteer.launch(launchArgs);

          for (const pathResult of pathResults) {
            const htmlBuffer = await fs.readFile(pathResult.path, 'utf-8');
            let page: any | undefined;
            try {
              page = await browser.newPage();

              await page.setViewport({ width: 1000, height: 800 });
              await page.setContent(htmlBuffer.toString(), { waitUntil: 'networkidle0' });

              const tmpImagePath = path.join(os.tmpdir(), `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`);
              await page.screenshot({ path: tmpImagePath, fullPage: true });

              const imageBuffer = await fs.readFile(tmpImagePath);
              const form = new FormData();
              form.append('chat_id', String(pathResult.chatId));
              form.append('photo', imageBuffer, 'image.png');

              await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form);
              // remove temp file
              try { await fss.promises.unlink(tmpImagePath); } catch (e) { /* ignore cleanup errors */ }
            } catch (err) {
              console.error('Error generating or sending image for', pathResult.chatId, err);
            } finally {
              if (page) {
                try { await page.close(); } catch (e) { /* ignore close errors */ }
              }
            }
          }
        } catch (err) {
          console.error('Browser launch or processing failed:', err);
          throw err;
        } finally {
          if (browser) {
            try { await browser.close(); } catch (e) { /* ignore */ }
          }
        }
        return {
          statusCode: 200,
          body: "Scoreboards sent"
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
    console.error('Error connecting to database:');
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    }
  }
}