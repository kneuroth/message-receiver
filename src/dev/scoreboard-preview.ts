import { CHRISTMAS_SCOREBOARD_TEMPLATE } from "../constants/templates/scoreboards/christmas-scoreboard";
import { DEFAULT_SCOREBOARD_TEMPLATE } from "../constants/templates/scoreboards/default-scoreboard";
import { CHRISTMAS_SVG_SCORE_MAP, DEFAULT_SVG_SCORE_MAP } from "../constants/svg-maps";
import { ScoreboardContext } from "@model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";
import { ARROW_DOWN_SVG, ARROW_UP_SVG } from "../constants/svgs";
import { MATRIX_SCOREBOARD_TEMPLATE } from "../constants/templates/scoreboards/matrix-scoreboard";
import { MATRIX_SCOREBOARD_AI_TEMPLATE } from "../constants/templates/scoreboards/matrix-scoreboard-ai";

async function main() {

  const SVG_MAP = CHRISTMAS_SVG_SCORE_MAP;
  const TEMPLATE = MATRIX_SCOREBOARD_TEMPLATE;

  const scoreboardContext: ScoreboardContext = {
    players: [

      {
        name: "Maggie",
        latestScore: 0,
        emoji: SVG_MAP[0],
        position: 1,
        positionDelta: ARROW_UP_SVG,
        scorePercentage: 20,
        color: "rgba(188, 20, 132, 1)",
        totalScore: 15
      },
      {
        name: "Matt",
        latestScore: 1,
        emoji: SVG_MAP[1],
        position: 2,
        positionDelta: ARROW_UP_SVG,
        scorePercentage: 45,
        color: "rgba(8, 190, 63, 1)",
        totalScore: 22
      },
      {
        name: "Chep",
        latestScore: 2,
        emoji: SVG_MAP[2],
        position: 3,
        positionDelta: ARROW_DOWN_SVG,
        scorePercentage: 45,
        color: "rgba(213, 103, 40, 1)",
        totalScore: 22
      },
      {
        name: "Kelly",
        latestScore: 3,
        emoji: SVG_MAP[3],
        position: 4,
        positionDelta: null,
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Anika",
        latestScore: 4,
        emoji: SVG_MAP[4],
        position: 5,
        positionDelta: null,
        scorePercentage: 66,
        color: "rgba(207, 51, 137, 1)",
        totalScore: 33
      },
      {
        name: "Emily",
        latestScore: 5,
        emoji: SVG_MAP[5],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Heather",
        latestScore: 6,
        emoji: SVG_MAP[6],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(80, 183, 16, 1)",
        totalScore: 44
      },
      {
        name: "Sean",
        latestScore: 7,
        emoji: SVG_MAP[7],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(25, 204, 147, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 8,
        emoji: SVG_MAP[8],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
    ]
  }
  const template = Handlebars.compile(TEMPLATE)
  const html = template(scoreboardContext);
  await fs.writeFile("scoreboard-preview.html", html);
  console.log("✅ Wrote preview.html — open it in a browser");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})