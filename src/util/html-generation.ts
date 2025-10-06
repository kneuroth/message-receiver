import { Scoreboard } from "@model/Scoreboard";
import { convertScoreboardToContext } from "./conversions";
import Handlebars from "handlebars";
import { SCOREBOARD_TEMPLATE } from "@constants/templates";

export function createHtmlScoreboard(scoreboard: Scoreboard): string {
  const template = Handlebars.compile(SCOREBOARD_TEMPLATE)
  const context = convertScoreboardToContext(scoreboard);
  return template(context);
}
