import { DEFAULT_SCORE_SVG_MAP } from "../constants/svg-maps";
import { DEFAULT_SCOREBOARD_TEMPLATE, CHRISTMAS_SCOREBOARD_TEMPLATE } from "../constants/templates";
import { ScoreboardContext } from "@model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";

async function main() {

  const SCORE_MAP = DEFAULT_SCORE_SVG_MAP;
  const TEMPLATE = DEFAULT_SCOREBOARD_TEMPLATE;

  const scoreboardContext: ScoreboardContext = {
    players: [

      {
        name: "Chapporieoes",
        latestScore: 0,
        emoji: SCORE_MAP[0],
        scorePercentage: 20,
        color: "rgba(188, 20, 132, 1)",
        totalScore: 15
      },
      {
        name: "Mattios",
        latestScore: 1,
        emoji: SCORE_MAP[1],
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Mattios",
        latestScore: 2,
        emoji: SCORE_MAP[2],
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Mattios",
        latestScore: 3,
        emoji: SCORE_MAP[3],
        scorePercentage: 45,
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22
      },
      {
        name: "Geofferey",
        latestScore: 4,
        emoji: SCORE_MAP[4],
        scorePercentage: 66,
        color: "rgba(42, 188, 20, 1)",
        totalScore: 33
      },
      {
        name: "Kelly",
        latestScore: 5,
        emoji: SCORE_MAP[5],
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 6,
        emoji: SCORE_MAP[6],
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 7,
        emoji: SCORE_MAP[7],
        scorePercentage: 77,
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Kelly",
        latestScore: 8,
        emoji: SCORE_MAP[8],
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