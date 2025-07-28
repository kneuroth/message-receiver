
import { drizzle } from "drizzle-orm/node-postgres";
import { addDays, format, subDays } from "date-fns";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";
import { scoreTable } from "../src/db/schema";
import 'dotenv/config';
import { SQL, Placeholder } from "drizzle-orm";

const players = [
  { player_id: 1, player_name: "Kelly" },
  { player_id: 2, player_name: "Jordan" },
  { player_id: 3, player_name: "Patsy" },
  { player_id: 4, player_name: "Daissy" },
  { player_id: 5, player_name: "Abbigale" },
];

const insertScoreSchema = createInsertSchema(scoreTable).extend({
  player_id: z.preprocess(val => Number(val), z.number()),
  chat_id: z.preprocess(val => Number(val), z.number()),
  score: z.preprocess(val => Number(val), z.number()),
});

async function main(daysAgo: number = 30) {
  const db = drizzle(process.env.DATABASE_URL!);

  var dayScores: { date: string | SQL<unknown> | Placeholder<string, any>; player_id: number | SQL<unknown> | Placeholder<string, any>; chat_id: number | SQL<unknown> | Placeholder<string, any>; score: number | SQL<unknown> | Placeholder<string, any>; player_name: string | SQL<unknown> | Placeholder<string, any>; }[] = [];

  // For every day in daysAgo
  for (let date = subDays(new Date(), daysAgo); date <= new Date(); date = addDays(date, 1)) {

    // Every player submits every day
    Array.from(players.values()).forEach((player) => {

      const score = {
        chat_id: 99, // Random chat_id between 98 and 99
        player_id: player.player_id,
        player_name: player.player_name,
        score: Math.floor(Math.random() * 8) + 1, // Random score between 1 and 8
        date: format(date, 'yyyy-MM-dd')
      }

      const scoreParse = insertScoreSchema.safeParse(score);
      if (scoreParse.success) {
        dayScores.push(scoreParse.data)
      }
    })

  }

  try {
    await db.insert(scoreTable).values(dayScores)//.onConflictDoUpdate({ target: [scoreTable.player_id, scoreTable.chat_id, scoreTable.date], set: { score: 8 } });;

  } catch (e) {
    console.error('Error inserting seed data:', e);
  }

}

main();