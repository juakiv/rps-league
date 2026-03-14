import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import APIFetch from "../utils/APIFetch";
import { getMoveAsEmoji } from "../utils/getMoveAsEmoji";

import { SkeletonRow } from "../components/Skeleton";

export default function Home() {
  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["matches"],
    queryFn: () => APIFetch(`/api/matches?pageSize=30`),
    refetchInterval: 10000,
  });

  const matches = data?.data || [];

  return (
    <>
      <div className="bg-neutral-800 border border-neutral-600 rounded p-4 mb-6">
        <h2 className="text-xl">Total Matches Played</h2>
        <p className="text-4xl font-bold">{data?.pagination.totalItems || "..."}</p>
      </div>
      <div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-2xl">Latest matches</h2>
        <div className="flex items-center gap-1 font-bold">
          <span className="inline-block size-4 bg-red-600 rounded-full mr-1 animate-pulse"></span> LIVE
        </div>
      </div>
      <div className="bg-neutral-800 border border-neutral-600 rounded">
        <div className="flex flex-row px-4 py-2 bg-neutral-700 rounded-t">
          <div className="font-bold flex-1">Player 1</div>
          <div className="font-bold flex-1">Player 2</div>
          <div className="font-bold flex-1">Winner</div>
          <div className="font-bold flex-1">Date</div>
        </div>
        {error && (
          <div className="p-4 text-red-500 text-center">
            Failed to load matches: {error.message}
          </div>
        )}
        {isFetching && !data && (
          <>
            {Array.from({ length: 30 }).map((_, i) => <SkeletonRow key={i} i={i} />)}
          </>
        )}
        <AnimatePresence initial={false}>
          {matches.map((match: any) => (
            <motion.div
              key={match.game_id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-row px-4 py-2 border-t border-neutral-600"
            >
              <div className="flex-1">
                <Link to={`/players/${match.player_a_name}`}>{match.player_a_name}</Link> 
                <span className="text-xs font-bold bg-green-600/20 border border-green-800/40 rounded px-1 py-0.5 inline-block ml-1">{getMoveAsEmoji(match.player_a_move)} {match.player_a_move}</span>
              </div>
              <div className="flex-1">
                <Link to={`/players/${match.player_b_name}`}>{match.player_b_name}</Link> 
                <span className="text-xs font-bold bg-rose-600/20 border border-rose-800/40 rounded px-1 py-0.5 inline-block ml-1">{getMoveAsEmoji(match.player_b_move)} {match.player_b_move}</span>
              </div>
              <div className="flex-1">{match.winner === "DRAW" ? "DRAW!" : match.winner === "B" ? match.player_b_name : match.winner === "A" ? match.player_a_name : "Invalid Winner"}</div>
              <div className="flex-1">{new Date(match.timestamp).toLocaleString("en-GB", { timeZone: "UTC" })}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}