import { Scoreboard } from "../model/Scoreboard";
import { Score } from "../model/Score";

export function convertScoresToScoreboards(scores: Score[] | undefined): Scoreboard[] {
  if (!scores) {
    return []
  }

  // TODO: Implement

  return [{
    chat_id: 0,
    month: "",
    players: []
  }]
}