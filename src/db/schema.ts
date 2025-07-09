import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const scoreTable = pgTable("scores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  player_id: integer().notNull(),
  chat_id: integer().notNull(),
  score: integer().notNull(),
  player_name: varchar({ length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
});