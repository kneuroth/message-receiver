import { getDaysInMonth } from "date-fns";
import { Scoreboard } from "../model/Scoreboard";
import { date } from "zod/v4";

export function createHtmlPodium(scoreboard: Scoreboard): string {
  const yearMonth = scoreboard.yearMonth;
  const chatId = scoreboard.chat_id;
  return `
  <style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    width: 500px;
  }
  .playerCard {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    width: 30%;
  }

  .playerCard.first {
    background-color: gold;
  }
  .playerCard.second {
    background-color: silver;
  }
  .playerCard.third {
    background-color: #cd7f32;
  }

  .podium {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    gap: 10px;
    text-align: center;
  }

  .placement {
    font-weight: bold;
    font-size: 1.4em;
    margin-top: -25px;
  }

  </style>

  <div> 
    <h1>Podium for ${yearMonth} (Chat ID: ${chatId})</h1>
    <div class="podium">
      
      <div class="playerCard second">
        <h2 class="placement">2nd</h2>
        <p>${scoreboard.players[0].player_name}</p>
        <p>Score: ${Object.values(scoreboard.players[0].scores).reduce((a, b) => a + b, 0)}</p>
      </div>
      <div class="playerCard first">
        <h2 class="placement">1st</h2>
        <p>${scoreboard.players[0].player_name}</p>
        <p>Score: ${Object.values(scoreboard.players[0].scores).reduce((a, b) => a + b, 0)}</p>
      </div>
      <div class="playerCard third">
        <h2 class="placement">3rd</h2>
        <p>${scoreboard.players[0].player_name}</p>
        <p>Score: ${Object.values(scoreboard.players[0].scores).reduce((a, b) => a + b, 0)}</p>
      </div>
    </div>
  </div>`
}

export function createScoreBars(scoreboard: Scoreboard): string {
  const yearMonth = scoreboard.yearMonth;

  const daysInMonth = getDaysInMonth(new Date(yearMonth + '-01'));
  const maxScore = daysInMonth * 8; // Assuming max score is 8 per day
  const highestPlayerScore = Math.max(...scoreboard.players.map(player =>
    Object.values(player.scores).reduce((a, b) => a + b, 0)
  ));
  var scoreBars = '';
  scoreboard.players.forEach(player => {
    const playerTotalScore = Object.values(player.scores).reduce((a, b) => a + b, 0);

    const maxSlice = 5 > player.scores.length ? player.scores.length : 5;

    const last5Scores = Object.entries(player.scores).sort((a, b) => b[0].localeCompare(a[0])).slice(0, maxSlice).map((dateScore) => {
      return `${dateScore[0]}: ${dateScore[1]}<br>`
    }).join('');

    scoreBars += `
    <div class="score-bar" style="height: ${playerTotalScore * 100 / highestPlayerScore}%; /* 0-100% based on inverse score */">
      <h2 class="player-name">${player.player_name}</h2>
      <h3 class="score"> ${playerTotalScore} </h3>
      <div class="last-scores">
        ${last5Scores}
      </div>
    </div>`
  })
  return `
  <style>
  .score-bar {
      width: 100%;
      background-color: #7f8cff;
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: start;
      justify-content: flex-end;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
  .last-scores {
    font-size: 16px;
  }
  .player-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: auto;
    }
  .score {
      font-size: 25px;
      font-weight: bold;
      margin-bottom: auto;
  }
  </style>
  ${scoreBars}
  `
}


export function createHtmlScoreboard(scoreboard: Scoreboard): string {
  const yearMonth = scoreboard.yearMonth;
  const chatId = scoreboard.chat_id;

  const scoreBars = createScoreBars(scoreboard);
  return `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px; 
    }
     .bar-container {
      width: 800px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #f0f0f0;
      border-radius: 8px;
      padding: 10px;
    }
  </style>
  
  <h1>Scoreboard for ${yearMonth}</h1>
  <div class="bar-container">
    ${scoreBars}
  </div>`;
}