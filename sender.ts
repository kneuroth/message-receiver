import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import nodeHtmlToImage from "node-html-to-image";
import { scoreTable } from "./src/db/schema";
import { createHTMLFile, HTMLCreationResult } from "./util/file-generation";
import { createHtmlScoreboard } from "./util/html-generation";
import { convertScoresToScoreboards } from "./util/logic";
import fs from 'fs/promises';
import os from 'os';
import { between } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";
import { format, startOfDay, startOfMonth } from "date-fns";
import axios from "axios";
import FormData from "form-data";
import { printFileTree } from "./util/debug";

const fss = require('fs');
const path = require('path');

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

module.exports.sendScoreboards = async () => {

  console.log("Sending scoreboards...");
  try {
    // Get scores where date is between current start of month and today
    const easternNow = toZonedTime(new Date(), 'America/New_York');
    const today = format(startOfDay(easternNow), 'yyyy-MM-dd');
    const startOfMonthDate = format(startOfMonth(easternNow), 'yyyy-MM-dd');

    // Query for scores
    const scores = await db.select().from(scoreTable).where(between(scoreTable.date, startOfMonthDate, today));

    console.log("Scores fetched:", scores.length);
    if (!scores || scores.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    } else {
      try {
        const scoreboards = convertScoresToScoreboards(scores);
        const pathResults = await Promise.all(scoreboards.map(sb => createHTMLFile(createHtmlScoreboard(sb), sb.chat_id)));
        const BOT_TOKEN = process.env.BOT_TOKEN!;

        // printFileTree('/opt/chromium')

        // Resolve Chromium executable once and log it
        let chromiumExecutable: string | undefined;
        try {
          // pass the layer path so -min packages also work
          chromiumExecutable = await chromium.executablePath('/opt/chromium/bin');
        } catch (err) {
          console.warn('chromium.executablePath() threw:', err);
        }

        console.log('resolved chromium executable:', chromiumExecutable);

        // If we got a path, check it exists (extra safety)
        if (chromiumExecutable) {
          try {
            const stat = fss.statSync(chromiumExecutable);
            console.log('chromium executable stats:', { size: stat.size, mode: (stat.mode & 0o777).toString(8) });
          } catch (err) {
            console.warn('chromium executable not accessible:', err);
          }
        }

        console.log("Starting image generation with improved Puppeteer args");

        // Common flags that help running Chrome in Lambda
        const extraArgs = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ];

        // Launch a single browser instance and process pages sequentially to avoid
        // exhausting memory/FDs in Lambda (Promise.all was creating many concurrent
        // browser/pages which caused the "Target closed" errors).
        const launchArgs = {
          executablePath: chromiumExecutable || await chromium.executablePath('/opt/chromium/bin'),
          args: [...(chromium.args || []), ...extraArgs],
          headless: true,
          dumpio: true,
          ignoreHTTPSErrors: true,
          timeout: 120000,
        };

        let browser: any | undefined;
        try {
          console.log('Launching shared browser with args:', launchArgs.args);
          browser = await puppeteer.launch(launchArgs);

          for (const pathResult of pathResults) {
            const htmlBuffer = await fs.readFile(pathResult.path, 'utf-8');
            let page: any | undefined;
            try {
              page = await browser.newPage();

              // Uncomment for debugging
              // page.on('console', (msg: any) => console.log('PAGE console:', msg.text()));
              // page.on('error', (err: any) => console.error('PAGE error:', err));
              // page.on('pageerror', (err: any) => console.error('PAGE pageerror:', err));

              await page.setViewport({ width: 1200, height: 800 });
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