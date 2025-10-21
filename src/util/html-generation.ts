import { Scoreboard } from "@model/Scoreboard";
import { convertScoreboardToContext } from "./conversions";
import Handlebars from "handlebars";

export function createHtmlScoreboard(scoreboard: Scoreboard, template: string, svgMap: { [key: number]: string }): string {
  const templateDelegate = Handlebars.compile(template);
  const context = convertScoreboardToContext(scoreboard, svgMap);
  return templateDelegate(context);
}
