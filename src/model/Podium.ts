import { z } from "zod/v4";
import { playerScoreSchema } from "./Scoreboard";

export const podiumPlayerScoreSchema = playerScoreSchema.extend({
  stat: z.string().optional(),
});

export const podiumSchema = z.object({
  chat_id: z.number(),
  yearMonth: z.string(),
  players: z.array(podiumPlayerScoreSchema)
})

export type Podium = z.infer<typeof podiumSchema>;