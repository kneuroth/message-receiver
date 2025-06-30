import { Game } from "../model/Game";
import { Score } from "../model/Score";

export function convertScoresToGame(scores: Score[] | undefined): Game[] {
  if (!scores) {
    return []
  }
  console.log(scores)
  let map = new Map<string, Map<string, number>>(
    [
      ['2024-01-01', new Map<string, number>(
        [['Kelly', 1]]
      )]
    ])

  return [{
    id: "",
    scoreboard: map,
    chat: 0
  }]
}