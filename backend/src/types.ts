export type Move = "ROCK" | "PAPER" | "SCISSORS";
export type Winner = "A" | "B" | "DRAW";

export interface Player {
  name: string;
  played: Move;
}

export interface Match {
  gameId: string;
  time: number;
  playerA: Player;
  playerB: Player;
  winner?: Winner;
}

export interface History {
  data: Match[];
  cursor: string | null;
}