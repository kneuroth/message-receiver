import { Scoreboard } from "@model/Scoreboard";
import { convertPodiumToContext, convertScoreboardToContext } from "./conversions";
import Handlebars from "handlebars";
import { Podium } from "@model/Podium";

export function createHtmlPodium(podium: Podium, template: string, svgMap: { [key: number]: string }): string {
  const templateDelegate = Handlebars.compile(template);
  const context = convertPodiumToContext(podium, svgMap);
  return templateDelegate(context);
}

export function createHtmlScoreboard(scoreboard: Scoreboard, template: string, svgMap: { [key: number]: string }): string {
  const templateDelegate = Handlebars.compile(template);
  const context = convertScoreboardToContext(scoreboard, svgMap);
  return templateDelegate(context);
}
