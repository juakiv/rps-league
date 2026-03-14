import { NewMatch } from "../db/schema";
import { computeWinner } from "./computeWinner";

function isValidIsoString(time: unknown): time is string {
  return typeof time === "string" && !isNaN(Date.parse(time));
}

export function normalizeMatch(match: any, cursor: string | null): NewMatch {
  const raw = match.time;

  let timestamp: Date;

  if (isValidIsoString(raw)) {
    timestamp = new Date(raw);
  } else if (typeof raw === "number" && !isNaN(raw)) {
    timestamp = raw > 1e12 ? new Date(raw) : new Date(raw * 1000);
  } else {
    console.warn(`Bad timestamp in game ${match.gameId}:`, raw);
    timestamp = 0 as unknown as Date;
  }

  if (isNaN(timestamp.getTime())) {
    console.warn(`Could not parse time for game ${match.gameId}`);
    timestamp = 0 as unknown as Date;
  }

  return {
    game_id: match.gameId,
    timestamp: timestamp.getTime(),
    player_a_name: String(match.playerA?.name ?? ""),
    player_a_move: String(match.playerA?.played.toUpperCase() ?? ""),
    player_b_name: String(match.playerB?.name ?? ""),
    player_b_move: String(match.playerB?.played.toUpperCase() ?? ""),
    winner: computeWinner(match.playerA, match.playerB) || undefined,
    cursor: cursor?.split("cursor=")[1] || null,
  };
}