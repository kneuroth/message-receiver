import { DEFAULT_PODIUM_TEMPLATE } from "../constants/templates/podiums/default-podium";
import { PodiumContext } from "../../src/model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";
import { CHRISTMAS_PODIUM_SVG_MAP, DEFAULT_PODIUM_SVG_MAP } from "../constants/svg-maps";
import { CHRISTMAS_PODIUM_TEMPLATE } from "../constants/templates/podiums/christmas-podium";

async function main() {

  const SVG_MAP = DEFAULT_PODIUM_SVG_MAP;
  const TEMPLATE = DEFAULT_PODIUM_TEMPLATE;

  const podiumContext: PodiumContext = {
    players: [

      {
        name: "Chep",
        color: "rgba(188, 20, 132, 1)",
        totalScore: 15,
        position: 1,
        emoji: SVG_MAP[1],
        stat: ""
      },

      {
        name: "Anika",
        color: "rgba(56, 240, 43, 1)",
        totalScore: 22,
        position: 2,
        emoji: SVG_MAP[2],
        stat: ""
      },
      {
        name: "Maggie",
        color: "rgba(240, 191, 43, 1)",
        totalScore: 25,
        position: 3,
        emoji: SVG_MAP[3],
        stat: ""
      },
      {
        name: "Matt",
        color: "rgba(208, 72, 41, 1)",
        totalScore: 28,
        position: 4,
        stat: ""
      },
      {
        name: "Ally",
        color: "rgba(36, 26, 225, 1)",
        totalScore: 33,
        position: 5,
        stat: ""
      },
      {
        name: "Sean",
        color: "rgba(37, 214, 173, 1)",
        totalScore: 44,
        position: 6,
        stat: ""
      },
      {
        name: "Erin",
        color: "rgba(202, 244, 51, 1)",
        totalScore: 44,
        position: 7,
        stat: ""
      },
    ]
  }
  const template = Handlebars.compile(TEMPLATE)
  const html = template(podiumContext);
  await fs.writeFile("podium-preview.html", html);
  console.log("✅ Wrote preview.html — open it in a browser");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})