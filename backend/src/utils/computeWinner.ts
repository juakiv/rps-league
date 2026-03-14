import { Player, Winner } from "../types";

export function computeWinner(playerA: Player, playerB: Player): Winner | null {
  const aMove = playerA.played?.toUpperCase();
  const bMove = playerB.played?.toUpperCase();

  if (!["ROCK", "PAPER", "SCISSORS"].includes(aMove) || !["ROCK", "PAPER", "SCISSORS"].includes(bMove)) {
    return null;
  }

  if (aMove === bMove) {
    return "DRAW";
  }

  if ((aMove === "ROCK" && bMove === "SCISSORS") ||
      (aMove === "PAPER" && bMove === "ROCK") ||
      (aMove === "SCISSORS" && bMove === "PAPER")) {
    return "A";
  }

  return "B";
}