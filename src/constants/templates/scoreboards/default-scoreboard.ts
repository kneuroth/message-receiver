export const DEFAULT_SCOREBOARD_TEMPLATE = `
<style>
  /* ----------------------------------
		 Theme variables
		 ---------------------------------- */
  :root {
    --bg: #121213;
    --panel: #3a3a3c;
    --muted: #8584848f;
    --gold: #b59f3b;
    --silver: #787c7e;
    --bronze: #a56a46;
    --green: #538d4e;
    --muted-gold: #b59f3bce;
    --text: #f8f8f8;
    --border: #78787d;
    --soft-shadow: rgba(136, 136, 144, 0.12);
  }
    
  body {
    font-family: sans-serif;
    font-size: 26px;
    color: #f8f8f8;
    background-color: #121213;
    width: 1200px;
    padding: 10px;
  }

  .tile {
    aspect-ratio: 1 / 1;
    border: 10px solid #121213;
    border-radius: 14px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    background-color: #3a3a3c;
  }

  .wordle-grid {
    display: flex;
    flex-direction: column;
    filter: blur(60px);
  }

  .wordle-grid-row {
    display: flex;
  }

  .scoreboard {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    border: 1px solid #78787d;
    box-shadow: #888890 0 0 5px;
    background-color: #121213;
  }

  .player-entry {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #8584848f;
    box-shadow: 0 0 10px #8584848f;
  }

  .scoreboard > .player-entry:nth-of-type(1) {
    background-color: #538d4e;
    box-shadow: 0 0 10px #538d4e;
    border: 1px solid #538d4e;
  }

  .scoreboard > .player-entry:nth-of-type(1) .name {
    font-size: 40px;
  }

  .scoreboard > .player-entry:nth-of-type(2) {
    background-color: #b59f3b;
    box-shadow: 0 0 10px #b59f3b;
    border: 1px solid #b59f3b;
  }

  .scoreboard > .player-entry:nth-of-type(3) {
    background-color: #b59f3bce;
    box-shadow: 0 0 10px #b59f3bce;
  }

  .progress-bar {
    height: 3rem;
    width: 60%;
    background-color: #8e8e91a8;
    backdrop-filter: blur(5px);
    border-radius: 4px;
    border: 4px solid #d8d5d550;
    align-items: center;
    box-shadow: #1e1e24 0 0 10px;
  }

  .progress {
    height: 3rem;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    backdrop-filter: blur(5px);
    background-color: rgba(14, 25, 122, 0.788);
    align-content: center;
  }

  p.score {
    margin: 0;
    margin-left: 1rem;
    text-wrap: nowrap;
    text-shadow: #111111 0 0 9px;
    font-weight: bold;
  }

  .player-details {
    text-shadow: #3a3a3c 0 0 9px;
    display: flex;
    width: 35%;
    justify-content: space-between;
    align-items: center;
  }

  .position {
    display: flex;
    align-items: center;
  }

  .score-section {
    height: 4rem;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    font-weight: bold;
    gap: 5px;
    background-color: #8e8e91a8;
    backdrop-filter: blur(5px);
    border-radius: 2rem;
    border: 4px solid #d8d5d550;
    backdrop-filter: blur(5px);
    box-shadow: #1e1e24 0 0 10px;
  }

  h3.name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>

<body>
  <div class='scoreboard'>
    {{#each players}}
      <div class='player-entry'>
        <div class='player-details'>
          <div class='position'>
            <h2>{{& position  }}</h2>
            {{& positionDelta }}
          </div>
          <h3 class='name'>{{name}}</h3>
          <div class='score-section'>
            <p>+{{latestScore}}</p> 
            {{& emoji }}
          </div>
        </div>
        <div class='progress-bar'>
          <div
            class='progress'
            style='width: {{scorePercentage}}%; background-color: {{color}};'
          >
            <p class='score'>{{totalScore}}</p>
          </div>
        </div>
      </div>
    {{/each}}
  </div>
</body>`