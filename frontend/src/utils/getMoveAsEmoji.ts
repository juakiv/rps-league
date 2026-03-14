export function getMoveAsEmoji(move: string): string {
  switch (move.toLocaleLowerCase()) {
    case "rock":
      return "🪨";
    case "paper":
      return "📄";
    case "scissors":
      return "✂️";
    default:
      return move;
  }
}