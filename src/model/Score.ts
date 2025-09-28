import { z } from "zod/v4";

export const scoreSchema = z.object({
  primary_key: z.string(),
  player_id: z.number(),
  player_name: z.string(),
  chat_id: z.number(),
  score: z.number(),
  date: z.string()
})

export type Score = z.infer<typeof scoreSchema>

export const insertScoreSchema = z.object({
  player_id: z.preprocess(val => Number(val), z.number()),
  player_name: z.string(),
  chat_id: z.preprocess(val => Number(val), z.number()),
  score: z.preprocess(val => Number(val), z.number()),
  date: z.string()
})

export type InsertScore = z.infer<typeof insertScoreSchema>