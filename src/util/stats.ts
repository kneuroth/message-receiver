export function generateStatForPlayer(name: string, scores: Record<string, number>): string {


  return `${name} has played ${Object.keys(scores).length} games.`;
}