export type ScoreboardContext = {
  players: {
    name: string;
    latestScore: number;
    emoji: string;
    scorePercentage: number;
    color: string | number[];
    totalScore: number;
  }[];
}

export type PodiumContext = {

}