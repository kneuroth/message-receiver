import { CHRISTMAS_SCOREBOARD_TEMPLATE } from "../constants/templates/scoreboards/christmas-scoreboard";
import { DEFAULT_SCOREBOARD_TEMPLATE } from "../constants/templates/scoreboards/default-scoreboard";
import { CHRISTMAS_SVG_MAP, DEFAULT_SVG_MAP } from "../constants/svg-maps";
import { ScoreboardContext } from "@model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";
import { ARROW_DOWN_SVG, ARROW_UP_SVG } from "../constants/svgs";

async function main() {

  const SVG_MAP = CHRISTMAS_SVG_MAP;
  const TEMPLATE = DEFAULT_SCOREBOARD_TEMPLATE;

  const scoreboardContext: ScoreboardContext = {
    players: [

      {
        name: "Chapporieoes",
        latestScore: 0,
        emoji: SVG_MAP[0],
        position: 1,
        positionDelta: ARROW_UP_SVG,
        scorePercentage: 20,
        color: "rgba(188, 20, 132, 1)",
        totalScore: 15
      },
      {
        name: "Mattios",
        latestScore: 1,
        emoji: SVG_MAP[1],
        position: 2,
        positionDelta: ARROW_UP_SVG,
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Mattios",
        latestScore: 2,
        emoji: SVG_MAP[2],
        position: 3,
        positionDelta: ARROW_DOWN_SVG,
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Mattios",
        latestScore: 3,
        emoji: SVG_MAP[3],
        position: 1,
        positionDelta: null,
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Geofferey",
        latestScore: 4,
        emoji: SVG_MAP[4],
        position: 1,
        positionDelta: null,
        scorePercentage: 66,
        color: "rgba(42, 188, 20, 1)",
        totalScore: 33
      },
      {
        name: "Kelly",
        latestScore: 5,
        emoji: SVG_MAP[5],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 6,
        emoji: SVG_MAP[6],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 7,
        emoji: SVG_MAP[7],
        position: 1,
        positionDelta: null,
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
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
  await fs.writeFile("preview.html", html);
  console.log("✅ Wrote preview.html — open it in a browser");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})