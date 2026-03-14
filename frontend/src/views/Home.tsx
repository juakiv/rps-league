import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import APIFetch from "../utils/APIFetch";
import { getMoveAsEmoji } from "../utils/getMoveAsEmoji";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["matches", page],
    queryFn: () => APIFetch(`/api/matches?page=${page}`),
    placeholderData: keepPreviousData
  });

  const pagination = data?.pagination;
  const goToPage = (p: number) => setSearchParams({ page: String(p) });

  return (
    <>
      <h2>Latest matches</h2>
      {isFetching && <p>Loading...</p>}
      {error && <p>Error occurred</p>}
      {data && (
        <>
          <div className="bg-neutral-800 border border-neutral-600 rounded">
            <div className="flex flex-row px-4 py-2 bg-neutral-700 rounded-t">
              <div className="font-bold flex-1">Player 1</div>
              <div className="font-bold flex-1">Player 2</div>
              <div className="font-bold flex-1">Winner</div>
              <div className="font-bold flex-1">Date</div>
            </div>
            {data.data.map((match: any) => (
              <div key={match.game_id} className="flex flex-row px-4 py-2 border-t border-neutral-600">
                <div className="flex-1">{match.player_a_name} <span className="text-sm bg-green-600/20 border border-green-800/40 rounded px-1 py-0.5">{getMoveAsEmoji(match.player_a_move)} {match.player_a_move}</span></div>
                <div className="flex-1">{match.player_b_name} <span className="text-sm bg-rose-600/20 border border-rose-800/40 rounded px-1 py-0.5">{getMoveAsEmoji(match.player_b_move)} {match.player_b_move}</span></div>
                <div className="flex-1">{match.winner === "DRAW" ? "DRAW!" : match.winner === "B" ? match.player_b_name : match.player_a_name}</div>
                <div className="flex-1">{new Date(match.timestamp).toLocaleString()}</div>
              </div>
            ))}
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
      )}
    </>
  )
}