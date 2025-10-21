export const DEFAULT_SCOREBOARD_TEMPLATE = `
<style>
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

// Broken but has good inspo
export const CHRISTMAS_SCOREBOARD_TEMPLATE = `
<style>
  :root{
    --snow:#eef6ff;
    --evergreen:#0f5132;
    --holly:#b91c1c;
    --gold:#d4af37;
    --silver:#c0c7d1;
    --char:#0b0c0d;
    --glass:#ffffff1a;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }

  body {
    font-family: ui-serif, Georgia, "Times New Roman", serif;
    font-size: 26px;
    color: var(--snow);
    background:
      radial-gradient(1500px 800px at 50% -200px, #173a2b 0%, #0d1f16 40%, #0a1510 100%),
      linear-gradient(#0b1a13, #0b1a13);
    width: 1200px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }



  .scoreboard {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    width: 100%;
    border: 1px solid #295c43;
    box-shadow: 0 8px 24px #0009, inset 0 0 0 1px #0008;
    background: linear-gradient(180deg, #0e241a, #0c1d16 60%, #0b1713 100%);
    border-radius: 18px;
    padding: 20px 16px 24px;
    position: relative;
  }

  /* each player row becomes an ornament tag with ribbon */
  .player-entry {
    position: relative;
    display: grid;
    grid-template-columns: 38% 1fr;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 16px 16px 16px 22px;
    background: linear-gradient(180deg, #143526, #10281e);
    border: 1px solid #1b3e2c;
    border-radius: 16px;
    box-shadow: 0 6px 14px #000a, inset 0 0 0 1px #0006;
    overflow: hidden;
  }

  /* podium accents */
  .scoreboard > .player-entry:nth-of-type(1){
    outline: 2px solid var(--evergreen);
    box-shadow: 0 0 0 2px #000 inset, 0 12px 24px #000c;
    background: linear-gradient(180deg, #165c3d, #11442f);
  }
  .scoreboard > .player-entry:nth-of-type(1) .name { font-size: 40px; color: #fff; text-shadow: 0 0 12px #0c2; }


  .player-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  h3.name {
    margin: 0;
    font-weight: 800;
    letter-spacing: .5px;
    color: var(--snow);
    text-shadow: 0 2px 0 #0c1410;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }

  .score-section {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    background: linear-gradient(180deg, #143625, #0f281d);
    border: 1px solid #1a3a2a;
    box-shadow: inset 0 0 12px #0008, 0 2px 6px #0008;
    font-weight: 700;
  }

  /* candy-cane progress bar frame */
  .progress-bar {
    height: 3.25rem;
    width: 100%;
    border-radius: 999px;
    border: 4px solid #103422;
    padding: 4px;
    background:
      repeating-linear-gradient(45deg,
        #ffffffcc 0 14px,
        #ffffffcc 14px 22px,
        #f53 22px 36px,
        #f53 36px 44px);
    box-shadow: inset 0 2px 10px #0009, 0 4px 20px #0009;
    overflow: hidden;
    position: relative;
  }

  /* inner fill: gently glossy with twinkle */
  .progress {
    height: 100%;
    min-width: 4%;
    border-radius: 999px;
    box-shadow: inset 0 -8px 16px rgba(255, 255, 255, 0.32), inset 0 2px 8px #fff8, 0 0 12px #5effb3aa;
    position: relative;
  }


  p.score {
    margin: 0;
    padding-left: 16px;
    text-wrap: nowrap;
    text-shadow: #05150b 0 0 9px;
    font-weight: 900;
    color: #063;
    mix-blend-mode: multiply;
  }

  /* legacy classes kept (not used here but safe) */
  .tile {
    aspect-ratio: 1 / 1;
    border: 10px solid #0e1a14;
    border-radius: 14px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    background-color: #284236;
  }
  .wordle-grid { display: none; }

  /* responsive-ish tightening for long names */
  @media (max-width: 1200px){
    body{ font-size: 24px; }
  }
</style>

<body>
  <div class="garland"></div>
  <div class='scoreboard'>
    {{#each players}}
      <div class='player-entry'>
        <div class='player-details'>
          <h3 class='name'>{{name}}</h3>
          <div class='score-section'>
            <p>+{{latestScore}}</p>
            {{& emoji }}
          </div>
        </div>
        <div class='progress-bar'>
          <div
            class='progress'
            style='width: {{scorePercentage}}%; {{#if color}}background: linear-gradient(180deg, {{color}});{{/if}}'
          >
            <p class='score'>{{totalScore}}</p>
          </div>
        </div>
      </div>
    {{/each}}
  </div>
</body>`
