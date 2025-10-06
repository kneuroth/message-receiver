export type ScoreboardContext = {
  players: {
    name: string;
    latestScore: number;
    scorePercentage: number;
    color: string | number[];
    totalScore: number;
  }[];
}

export type PodiumContext = {

}