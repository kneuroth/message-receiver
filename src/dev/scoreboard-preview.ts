import { SCOREBOARD_TEMPLATE } from "../constants/templates";
import { ScoreboardContext } from "@model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";

async function main() {

  const scoreboardContext: ScoreboardContext = {
    players: [
      {
        name: "Kelly",
        latestScore: 4,
        scorePercentage: 77,
        color: "#rgba(0, 65, 149, 1)",
        totalScore: 44
      },
      {
        name: "Geofferey",
        latestScore: 7,
        scorePercentage: 66,
        color: "#rgba(42, 188, 20, 1)",
        totalScore: 33
      }
    ]
  }
  const template = Handlebars.compile(SCOREBOARD_TEMPLATE)
  const html = template(scoreboardContext);
  await fs.writeFile("preview.html", html);
  console.log("✅ Wrote preview.html — open it in a browser");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})