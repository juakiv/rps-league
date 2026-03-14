import { getMoveAsEmoji } from "../utils/getMoveAsEmoji";

export default function Move({ move, isWinning }: { move: string; isWinning?: boolean }) {
  const moveEmoji = getMoveAsEmoji(move);
  return (
    <span className={`text-xs font-bold ${isWinning ? "bg-green-600/20 border border-green-800/40" : "bg-rose-600/20 border border-rose-800/40"} rounded px-1 py-0.5 inline-block ml-1`}>
      {moveEmoji} {move}
    </span>
  );
}