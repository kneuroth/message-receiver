export type Game = {
  id: string,
  scoreboard: Map<string, Map<string, number>>,
  chat: number
}