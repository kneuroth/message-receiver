export type ScoreboardContext = {
  players: {
    name: string;
    latestScore: number;
    emoji: string;
    position: number;
    positionDelta: string | null;
    scorePercentage: number;
    color: string | number[];
    totalScore: number;
  }[];
}

export type PodiumContext = {
  players: {
    name: string;
    emoji?: string;
    position: number;
    color: string | number[];
    totalScore: number;
    stat: string;
  }[];
}