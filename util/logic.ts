import { Scoreboard } from "../model/Scoreboard";
import { Score } from "../model/Score";

export function convertScoresToScoreboards(scores: Score[] | undefined): Scoreboard[] {
  if (!scores) {
    return []
  }

  // Create a list of scoreboards, uniquely id by chat_id and month
  var scoreboards: { [key: string]: Scoreboard } = {};

  // For each score
  for (const score of scores) {
    const chat_id = score.chat_id;
    const month = score.date.substring(0, 7); // YYYY-MM format
    const scoreboardKey = `${chat_id}_${month}`;

    const player_id = score.player_id;
    const player_name = score.player_name;
    const scoreValue = score.score;
    if (scoreboards[scoreboardKey]) {
      // If scoreboard exists, check if player exists
      const existingPlayer = scoreboards[scoreboardKey].players.find(p => p.player_id === player_id);
      if (existingPlayer) {
        // If player exists, update their score
        existingPlayer.scores[score.date] = scoreValue;
      } else {
        // If player does not exist, create a new player entry
        const newPlayer = {
          player_id: player_id,
          player_name: player_name,
          scores: { [score.date]: scoreValue }
        };
        scoreboards[scoreboardKey].players.push(newPlayer);
      }
    } else {
      const player = {
        player_id: player_id,
        player_name: player_name,
        scores: { [score.date]: scoreValue }
      }
      // Create a new scoreboard if it doesn't exist
      scoreboards[scoreboardKey] = {
        chat_id: chat_id,
        month: month,
        players: [player]
      };
    }
  }
  // get the chat_id and month (from date) 
  // if scoreboard for chat_id and month does not exist, create it
  // if player does not exist in scoreboard, create it and add to scoreboard


  return scoreboards ? Object.values(scoreboards) : [];
}