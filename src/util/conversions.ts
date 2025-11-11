import { ScoreSchema } from "@db/schema";
import { PodiumContext, ScoreboardContext } from "@model/Context";
import { Scoreboard } from "@model/Scoreboard";
import { format, getDate, getDaysInMonth, lastDayOfMonth, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { hashColor } from "./color-hash";
import { Podium } from "@model/Podium";
import { generateStatForPlayer } from "./stats";
import { ARROW_DOWN_SVG, ARROW_UP_SVG } from "@constants/svgs";

export function convertPodiumToContext(podium: Podium, svgMap: { [key: number]: string }): PodiumContext {

  return {
    players: podium.players
      .sort((playerA, playerB) => {
        const aTotalScore = Object.values(playerA.scores).reduce((a, b) => a + b, 0);
        const bTotalScore = Object.values(playerB.scores).reduce((a, b) => a + b, 0);
        // sort ascending so lowest total comes first (position 1)
        return aTotalScore - bTotalScore;
      }).
      map((player, index) => {
        const totalScore = Object.values(player.scores).reduce((a, b) => a + b, 0);
        const position = index + 1;
        return {
          name: player.player_name,
          position: position,
          color: hashColor(player.player_id, podium.chat_id),
          emoji: svgMap[position] || '',
          totalScore: totalScore,
          stat: player.stat || ''
        }
      })
  }
}


export function convertScoreboardToContext(scoreboard: Scoreboard, svgMap: { [key: number]: string }): ScoreboardContext {
  const yearMonth = scoreboard.yearMonth;

  // This date is to be trusted because it comes from the scoreboard's yearMonth
  const daysInMonth = getDaysInMonth(new Date(yearMonth + '-01'));
  const maxScore = daysInMonth * 8;

  // Build position maps for today and yesterday (based on America/New_York)
  const todayEastern = toZonedTime(new Date(), 'America/New_York');
  const yesterdayEastern = subDays(todayEastern, 1);
  const todayKey = format(todayEastern, 'yyyy-MM-dd');
  const yesterdayKey = format(yesterdayEastern, 'yyyy-MM-dd');

  // If yesterday is before the start of this scoreboard's month, treat it as "no yesterday"
  const scoreboardStart = new Date(`${yearMonth}-01`);
  const hasValidYesterday = yesterdayEastern >= scoreboardStart;

  // Map of total scores for each player
  const totalScoresMap: { [playerId: number]: number } = {};
  scoreboard.players.forEach(player => {
    totalScoresMap[player.player_id] = Object.values(player.scores).reduce((a, b) => a + b, 0);
  });

  // Map of latest scores for each player
  const latestScoresMap: { [playerId: number]: number } = {};
  scoreboard.players.forEach(player => {
    latestScoresMap[player.player_id] = player.scores[yesterdayKey] || 0;
  });

  // Today's standings (total as of now) - ascending so lowest total -> rank 1
  const standingsToday = scoreboard.players.map(p => ({
    id: p.player_id,
    name: p.player_name,
    total: totalScoresMap[p.player_id]
  })).sort((a, b) => a.total - b.total);

  const positionMapToday: { [id: number]: number } = {};
  standingsToday.forEach((entry, idx) => { positionMapToday[entry.id] = idx + 1 });

  // Yesterday's standings (total up to yesterday)
  const positionMapYesterday: { [id: number]: number } = {};
  if (hasValidYesterday) {
    const standingsYesterday = scoreboard.players.map(p => ({
      id: p.player_id,
      name: p.player_name,
      total: totalScoresMap[p.player_id] - (latestScoresMap[p.player_id] || 0)
    })).sort((a, b) => a.total - b.total);
    standingsYesterday.forEach((entry, idx) => { positionMapYesterday[entry.id] = idx + 1 });
  }

  return {
    players: scoreboard.players
      .sort((playerA, playerB) => {
        const aTotalScore = totalScoresMap[playerA.player_id];
        const bTotalScore = totalScoresMap[playerB.player_id];
        // sort ascending so players[0] is the lowest scorer (position 1)
        return aTotalScore - bTotalScore;
      }).
      map(player => {
        const totalScore = totalScoresMap[player.player_id];
        const latestScore = latestScoresMap[player.player_id] || 0;

        const positionToday = positionMapToday[player.player_id] || 0;
        const positionYesterday = hasValidYesterday ? positionMapYesterday[player.player_id] : undefined;

        let positionDelta: string | null = null;
        if (hasValidYesterday && typeof positionYesterday === 'number') {
          const delta = positionYesterday - positionToday;
          if (delta > 0) positionDelta = ARROW_UP_SVG;
          else if (delta < 0) positionDelta = ARROW_DOWN_SVG;
          else positionDelta = null;
        }

        console.log(`Player ${player.player_name} - Today: ${positionToday}, Yesterday: ${positionYesterday}, Delta: ${positionDelta}`);

        return {
          name: player.player_name,
          latestScore: latestScore,
          emoji: svgMap[latestScore],
          position: positionToday,
          positionDelta: positionDelta,
          scorePercentage: (totalScore / maxScore) * 100,
          color: hashColor(player.player_id, scoreboard.chat_id),
          totalScore: totalScore
        }
      })
  }
}

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

export function convertScoreboardsToPoduims(scoreboards: Scoreboard[] | undefined): Podium[] {
  if (!scoreboards) {
    return []
  }

  let podiums: Podium[] = [];

  scoreboards.forEach(scoreboard => {

    podiums.push({
      chat_id: scoreboard.chat_id,
      yearMonth: scoreboard.yearMonth,
      players: scoreboard.players.map(player => {
        const stat = generateStatForPlayer(player.player_name, player.scores);
        return {
          player_id: player.player_id,
          player_name: player.player_name,
          scores: player.scores,
          stat: stat
        }
      })
    });

  });
  return podiums;
}