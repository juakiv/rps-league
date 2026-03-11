import { Match, Player, Winner, History } from "../types";

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

export function computeWinner(playerA: Player, playerB: Player): Winner | null {
  if (!["ROCK", "PAPER", "SCISSORS"].includes(playerA.played) || !["ROCK", "PAPER", "SCISSORS"].includes(playerB.played)) {
    return null;
  }

  if (playerA.played === playerB.played) {
    return "DRAW";
  }

  if ((playerA.played === "ROCK" && playerB.played === "SCISSORS") ||
      (playerA.played === "PAPER" && playerB.played === "ROCK") ||
      (playerA.played === "SCISSORS" && playerB.played === "PAPER")) {
    return "A";
  }

  return "B";
}