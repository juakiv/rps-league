import { Player, Winner } from "../types";

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