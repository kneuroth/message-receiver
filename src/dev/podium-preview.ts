import { DEFAULT_PODIUM_TEMPLATE } from "../constants/templates/podiums/default-podium";
import { PodiumContext } from "../../src/model/Context";
import { promises as fs } from "fs";
import Handlebars from "handlebars";

async function main() {

  const TEMPLATE = DEFAULT_PODIUM_TEMPLATE;

  const podiumContext: PodiumContext = {
    players: [

      {
        name: "Chapporieoes",
        color: "rgba(188, 20, 132, 1)",
        totalScore: 15,
        position: 1,
        stat: ""
      },
      {
        name: "Mattios",
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22,
        position: 2,
        stat: ""
      },
      {
        name: "Mattios",
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22,
        position: 3,
        stat: ""
      },
      {
        name: "Mattios",
        color: "rgba(240, 191, 43, 1)",
        totalScore: 22,
        position: 4,
        stat: ""
      },
      {
        name: "Geofferey",
        color: "rgba(42, 188, 20, 1)",
        totalScore: 33,
        position: 5,
        stat: ""
      },
      {
        name: "Kelly",
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44,
        position: 6,
        stat: ""
      },
      {
        name: "Kelly",
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44,
        position: 7,
        stat: ""
      },
      {
        name: "Kelly",
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44,
        position: 8,
        stat: ""
      },
      {
        name: "Kelly",
        color: "rgba(0, 65, 149, 1)",
        totalScore: 44,
        position: 9,
        stat: ""
      },
    ]
  }
  const template = Handlebars.compile(TEMPLATE)
  const html = template(podiumContext);
  await fs.writeFile("preview.html", html);
  console.log("✅ Wrote preview.html — open it in a browser");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})