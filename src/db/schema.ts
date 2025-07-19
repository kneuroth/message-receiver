import { integer, bigint, pgTable, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod/v4";

export const scoreTable = pgTable("scores", {
  player_id: bigint({ mode: 'number' }).notNull(),
  chat_id: bigint({ mode: 'number' }).notNull(),
  score: integer().notNull(),
  player_name: varchar({ length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
}, (table) => ([
  primaryKey({ name: 'id', columns: [table.player_id, table.chat_id, table.date] })
]));

export const ScoreSchema = createSelectSchema(scoreTable);
export type ScoreSchema = z.infer<typeof ScoreSchema>;