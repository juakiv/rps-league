import { Match, History } from "../types";
import { computeWinner } from "../utils/computeWinner";

export async function fetchHistory(cursor: string | null): Promise<History> {
  const response = await fetch(`${process.env.REAKTOR_API_URL}/history${cursor ? `?cursor=${cursor}` : ""}`, {
    headers: {
      Authorization: `Bearer ${process.env.REAKTOR_API_KEY}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  const data = await response.json();

  data.data.map((match: Match) => {
    if (!match.winner) {
      match.winner = computeWinner(match.playerA, match.playerB) || undefined;
    }
  });

  return data as History;
}