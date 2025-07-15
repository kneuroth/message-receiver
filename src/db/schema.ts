import { integer, bigint, pgTable, varchar } from "drizzle-orm/pg-core";

export const scoreTable = pgTable("scores", {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  player_id: bigint({ mode: 'number' }).notNull(),
  chat_id: bigint({ mode: 'number' }).notNull(),
  score: integer().notNull(),
  player_name: varchar({ length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
});