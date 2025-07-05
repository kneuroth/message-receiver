import { z } from "zod/v4";

export const playerScoreSchema = z.object({
  player_id: z.number(),
  player_name: z.string(),
  scores: z.record(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // date in YYYY-MM-DD format
    z.number()
  )
})

export type PlayerScore = z.infer<typeof playerScoreSchema>;

export const scoreboardSchema = z.object({
  chat_id: z.number(),
  month: z.string(),
  players: z.array(playerScoreSchema)
})

export type Scoreboard = z.infer<typeof scoreboardSchema>;