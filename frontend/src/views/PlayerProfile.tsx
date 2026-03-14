import { Link, useParams, useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import APIFetch from "../utils/APIFetch";
import { getMoveAsEmoji } from "../utils/getMoveAsEmoji";

import { SkeletonRow } from "../components/Skeleton";

export default function PlayerProfile() {
  const { name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["playerProfile", name, page],
    queryFn: () => APIFetch(`/api/players/${name}?pageSize=30&page=${page}`),
    refetchInterval: 10000,
    placeholderData: keepPreviousData
  });

  const pagination = data?.pagination || { page: 1, totalPages: 1 };
  const goToPage = (newPage: number) => setSearchParams({ page: newPage.toString() });

  const matches = data?.data || [];

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-2xl">{name}'s latest matches ({pagination.totalItems || 0} matches)</h2>
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
              <div className="flex-1">{match.winner === "DRAW" ? "DRAW!" : match.winner === "B" ? match.player_b_name : match.winner === "A" ? match.player_a_name : "Unknown"}</div>
              <div className="flex-1">{new Date(match.timestamp).toLocaleString()}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50" disabled={page === 1} onClick={() => goToPage(page - 1)}>
          Previous
        </button>
        <span>Page {pagination.page} / {pagination.totalPages}</span>
        <button className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50" disabled={page === pagination.totalPages} onClick={() => goToPage(page + 1)}>
          Next
        </button>
      </div>
    </>
  )
}