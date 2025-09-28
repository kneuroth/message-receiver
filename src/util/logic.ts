import { ScoreSchema } from "@db/schema";
import { Scoreboard } from "@model/Scoreboard";
import { getDate, lastDayOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function convertScoresToScoreboards(scores: ScoreSchema[] | undefined): Scoreboard[] {
  if (!scores) {
    return []
  }

  // Create a list of scoreboards, uniquely id by chat_id and month
  var scoreboards: { [key: string]: Scoreboard } = {};

  // For each score
  for (const score of scores) {
    const chat_id = score.chat_id;
    const yearMonth = score.date.substring(0, 7); // YYYY-MM format
    const scoreboardKey = `${chat_id}_${yearMonth}`;

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
      // If scoreboard does not exist, create a new player and a new scoreboard
      const player = {
        player_id: player_id,
        player_name: player_name,
        scores: { [score.date]: scoreValue }
      }
      scoreboards[scoreboardKey] = {
        chat_id: chat_id,
        yearMonth: yearMonth,
        players: [player]
      };
    }
  }


  // Fill in scores of 8 for all players in scoreboards with no scores from month's start to most recent date

  for (let scoreboard of Object.values(scoreboards)) {
    scoreboard.players.forEach(player => {
      // Loop through all the dates from the start of the month to the most recent date
      // If the player does not have a score for that date, create an entry with a score of 8
      const todayEastern = toZonedTime(new Date(), 'America/New_York');
      const startDate = new Date(`${scoreboard.yearMonth}-01`);
      const endOfMonth = new Date(`${scoreboard.yearMonth}-${getDate(lastDayOfMonth(new Date(`${scoreboard.yearMonth}-01`)))}`);

      const endDate = endOfMonth > todayEastern ? todayEastern : endOfMonth;

      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD format
        if (!player.scores[dateKey]) {
          player.scores[dateKey] = 8; // Default score of 8
        }
      }
    })
  }

  return scoreboards ? Object.values(scoreboards) : [];
}