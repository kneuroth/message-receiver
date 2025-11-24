export const DEFAULT_PODIUM_TEMPLATE = `
<style>
  /* ----------------------------------
		 Theme variables
		 ---------------------------------- */
  :root {
    --bg: #121213;
    --panel: #3a3a3c;
    --muted: #8584848f;
    --gold-dark: #ae8625;
    --gold: #d2ac47;
    --gold-light: #f7ef8a;
    --silver-dark: #606264ff;
    --silver: #787c7e;
    --silver-light: #a8aaad;
    --bronze-dark: #8c5a32;
    --bronze: #a56a46;
    --bronze-light: #d99c6c;
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

  /* Root container - match the default scoreboard border + shadow */
  .container {
    width: 1200px;
    padding: 20px;
    box-sizing: border-box;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow:
      0 0 8px var(--soft-shadow),
      inset 0 0 0 1px rgba(0, 0, 0, 0.06);
    margin: 12px auto;
  }

  /* ------------------------
		 Podium area styles
		 ------------------------ */
  .podium-wrap {
    display: flex;
    gap: 20px;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 20px;
  }

  .podium-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 260px;
  }

  .podium-block {
    width: 100%;
    border-radius: 12px 12px 6px 6px;
    padding: 18px 14px 14px;
    box-sizing: border-box;
    text-align: center;
    color: var(--text);
    background: linear-gradient(180deg, var(--panel), #2f2f2f);
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  }

  .podium-pos {
    font-size: 28px;
    font-weight: 800;
    opacity: 0.95;
    margin-bottom: 8px;
  }

  .podium-name {
    font-size: 22px;
    font-weight: 800;
    margin: 6px 0;
  }

  .podium-score {
    font-size: 20px;
    font-weight: 700;
    opacity: 0.95;
  }

  /* Specific heights and color accents for 1/2/3 */
  .col-1 .podium-block {
    height: 300px;
    background: linear-gradient(to top, var(--gold-dark), var(--gold-light), var(--gold), var(--gold-dark), var(--gold));
    box-shadow: 0 0 10px var(--gold);
    border: 1px solid var(--gold);
  }

  .col-2 .podium-block {
    height: 220px;
    background: linear-gradient(to top, var(--silver-dark), var(--silver-light), var(--silver));
    box-shadow: 0 0 10px var(--silver);
    border: 1px solid var(--silver);
  }

  .col-3 .podium-block {
    height: 180px;
    background: linear-gradient(to top, var(--bronze-dark), var(--bronze-light), var(--bronze));
    box-shadow: 0 0 10px var(--bronze);
  }

  .podium-badge {
    display: inline-block;
    margin-top: 12px;
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.12);
  }

  /* ------------------------
		 Bottom table (classic) - keep structure but improve visuals
		 ------------------------ */
  .table {
    width: 100%;
    border-collapse: separate;
    margin-top: 8px;
    border-spacing: 0 10px;
  }

  .table th,
  .table td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .table thead {
    background-color: var(--panel);
    box-shadow: 0 0 10px var(--panel);
  }

  .table tr {

    padding: 7px;
  }

  .table th {
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }

  .table td.position {
    width: 64px;
    font-weight: 800;
  }
  .table td.name {
    width: 380px;
  }
  .table td.score {
    width: 120px;
    font-weight: 800;
  }

  /* Responsive safety */
  @media (max-width: 1200px) {
    .container {
      width: 100%;
      padding: 16px;
    }
  }
</style>
<body>
  <div class="container">
    <div class="podium-wrap">
      {{#with players.[1]}}
        <div class="podium-col col-2">
          <div class="podium-pos">2</div>
          <div class="podium-block">
            <div class="podium-name">
              {{&emoji }} 
              {{name}} 
              {{&emoji }}
            </div>
            <div class="podium-score">{{totalScore}}</div>
          </div>
        </div>
      {{/with}}

      {{#with players.[0]}}
        <div class="podium-col col-1">
          <div class="podium-pos">1</div>
          <div class="podium-block">
            <div class="podium-name">
              {{&emoji }} 
              {{name}} 
              {{&emoji }}
            </div>
            <div class="podium-score">{{totalScore}}</div>
          </div>
        </div>
      {{/with}}
 
      {{#with players.[2]}}
        <div class="podium-col col-3">
          <div class="podium-pos">3</div>
          <div class="podium-block">
            <div class="podium-name">
              {{&emoji }} 
              {{name}} 
              {{&emoji }}
            </div>
            <div class="podium-score">{{totalScore}}</div>
          </div>
        </div>
      {{/with}}
    </div>

    <table class="table" role="table">
      <tbody>
        {{#each players}}
          <tr style="background-color: {{color}}; box-shadow: 0 0 10px {{color}};">
            <td class="position">{{position}}</td>
            <td class="name">{{name}}</td>
            <td class="stat">{{stat}}</td>
            <td class="score">{{totalScore}}</td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
<body>

`;