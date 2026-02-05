// AUTO-GENERATED from matrix-scoreboard-ai.hbs - DO NOT EDIT DIRECTLY
// Run 'npm run build:templates' to regenerate

export const MATRIX_SCOREBOARD_AI_TEMPLATE = `
<style>
  /* ----------------------------------
		 Theme variables
		 ---------------------------------- */
  :root {
    --bg: #000000;
    --panel: #1a1a1a;
    --muted: #8584848f;
    --gold: #b59f3b;
    --silver: #787c7e;
    --bronze: #a56a46;
    --muted-gold: #b59f3bce;
    --text: #f8f8f8;
    --border: #00FF41;
    --green-bright: #00FF41;
    --green-mid: #008F11;
    --green-dark: #003B00;
    --white: #ffffff;
  }

  body {
    font-family: "Courier Prime", monospace;
    font-weight: 400;
    font-style: normal;
    font-size: 26px;
    color: var(--green-bright);
    text-shadow: 0 0 5px var(--green-bright);
    background-color: var(--bg);
    width: 1200px;
    padding: 20px;
    margin: 0 auto;
    border: 2px solid var(--border);
    box-shadow: inset 0 0 20px rgba(0, 255, 65, 0.1);
  }

  .scoreboard {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--green-mid);
    box-shadow: 0 0 10px var(--green-dark);
    position: relative;
  }

  .scoreboard::before {
    content: 'MATRIX SCOREBOARD';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: var(--green-mid);
    text-shadow: 0 0 3px var(--green-bright);
    background-color: var(--bg);
    padding: 5px 10px;
    border: 1px solid var(--green-bright);
  }

  .player-entry {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    border: 1px solid var(--green-mid);
    margin-bottom: 10px;
    padding: 15px;
    border-left: 3px solid var(--green-bright);
    box-shadow: inset 0 0 5px rgba(0, 255, 65, 0.2);
  }

  .progress-bar {
    height: 3rem;
    width: 60%;
    background-color: var(--bg);
    border: 1px solid var(--green-bright);
    border-top: 2px solid var(--green-bright);
    border-bottom: 2px solid var(--green-bright);
    align-items: center;
    position: relative;
  }

  .progress-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.1) 2px,
      rgba(0, 255, 65, 0.1) 4px
    );
  }

  .progress {
    height: 3rem;
    background: linear-gradient(90deg, var(--green-dark), var(--green-mid));
    border-right: 2px solid var(--green-bright);
    align-content: center;
    position: relative;
  }

  .progress::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 3px,
      rgba(0, 255, 65, 0.3) 3px,
      rgba(0, 255, 65, 0.3) 6px
    );
  }

  p.score {
    margin: 0;
    margin-left: 1rem;
    text-wrap: nowrap;
    font-weight: bold;
  }

  .player-details {
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
    border: 1px solid var(--green-mid);
    background-color: rgba(0, 0, 0, 0.5);
  }

  h3.name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .matrix-chars {
    color: var(--green-bright);
    font-size: 14px;
    text-shadow: 0 0 3px var(--green-bright);
    opacity: 0.8;
  }

</style>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
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
            style='width: {{scorePercentage}}%;'
          >
            <p class='score' style='color: {{color}}; text-shadow: 4px 4px 10px {{color}}, -4px -4px 10px {{color}};'>{{totalScore}}&nbsp;<span class='matrix-chars' '></span></p>
          </div>
        </div>
      </div>
    {{/each}}
  </div>
  <script>
  function getMatrixChars(scorePercentage) {
    const shrunkPercent = Math.floor(scorePercentage/2)
    const matrixChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#\$%&()███████████{}[]|<>?абвгдежзийклмнопрстуфхцчшщъыьэюя'
    let result = '';
    for (let i = 0; i < shrunkPercent; i++) {
      const randomIndex = Math.floor(Math.random() * matrixChars.length)
      result += matrixChars[randomIndex]
    }
    return result + '█'
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.progress').forEach((progressEl) => {
      const scorePercentage = parseFloat(progressEl.style.width)
      const matrixSpan = progressEl.querySelector('.matrix-chars')
      if (matrixSpan) {
        matrixSpan.textContent =  getMatrixChars(scorePercentage)
      }
    })
  })
  </script>
</body>
`;
