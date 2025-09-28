import { Scoreboard } from "@model/Scoreboard";
import { format, getDaysInMonth } from "date-fns";

const COLORS = ['#b59f3b', '#538d4e'];

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

export function createScores(scoreboard: Scoreboard): string {
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
      return `
        <div style="display: flex; justify-content: space-between">
          <span style="font-weight:bold">${format(new Date(dateScore[0]), 'EEEE')}</span> 
          <span>${dateScore[1]}</span>
        </div>
      `
    }).join('');

    scoreBars += `
    <div class="player-area">
    <div class="content">
        <h2 class="player-name">${player.player_name}</h2>
        <h3 class="score"> ${playerTotalScore} </h3>
        <div class="last-scores">
          ${last5Scores}
        </div>
      </div> 
      <div class="wordle-grid">`
      + Array.from({ length: maxScore }).map((_, i) => {
        if (i < playerTotalScore) {
          const color = Math.round(Math.random()) === 1 ? 'yellow' : 'green'
          return `<div class="${color}-tile"></div>`
        }
        return '<div class="tile"></div>'
      }).join('') +
      `</div>
      
    </div>`
  })
  return `
  <style>
    .wordle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, 15px);
      gap: 1px;
      max-width: 100%;
    }

    .tile, .yellow-tile, .green-tile {
      width: 10px;
      height: 10px;
      border: 2px solid #ccc;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .green-tile {
      background-color: #538d4e;
    }

    .yellow-tile {
      background-color:  #b59f3b;
    }
        
    .player-area {
      width: 100%;
      border-radius: 4px 4px 0 0;
      justify-items: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      height: auto;
    }

    .content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: start;
      justify-content: center;
      z-index: 1;
    }
    .last-scores {
      font-size: 16px;
      width: 100%;
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

  const scoreBars = createScores(scoreboard);
  return `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px; 
    }
     .container {
      height: auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #121213;
      padding: 10px;
      gap: 20px;
    }
  </style>
  
  <div class="container">
    ${scoreBars}
  </div>`;
}