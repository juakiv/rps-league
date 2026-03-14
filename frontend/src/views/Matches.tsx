import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import APIFetch from "../utils/APIFetch";
import { formatDate, getCurrentMonthRange, getCurrentWeekRange } from "../utils/dateUtils";
import { getMoveAsEmoji } from "../utils/getMoveAsEmoji";

import { SkeletonRow } from "../components/Skeleton";

export default function Matches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const startDate = searchParams.get("startDate") || formatDate(new Date());
  const endDate = searchParams.get("endDate") || formatDate(new Date());

  const [startDateInput, setStartDateInput] = useState(startDate);
  const [endDateInput, setEndDateInput] = useState(endDate);

  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["matches", startDate, endDate, page],
    queryFn: () => APIFetch(`/api/matches?pageSize=30&startDate=${startDate}&endDate=${endDate}&page=${page}`),
    refetchInterval: 10000,
    placeholderData: keepPreviousData
  });

  const changeDateRange = (newStartDate: string, newEndDate: string) => {
    setSearchParams({ startDate: newStartDate, endDate: newEndDate });
    setStartDateInput(newStartDate);
    setEndDateInput(newEndDate);
  };

  const setToday = () => changeDateRange(formatDate(new Date()), formatDate(new Date()));
  const setThisWeek = () => {
    const { start, end } = getCurrentWeekRange();
    changeDateRange(start, end);
  };
  const setThisMonth = () => {
    const { start, end } = getCurrentMonthRange();
    changeDateRange(start, end);
  };

  const pagination = data?.pagination || { page: 1, totalPages: 1 };
  const goToPage = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage.toString());
      return params;
    });
  };

  const matches = data?.data || [];

  return (
    <>
      <div className="flex items-center mb-4 justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-neutral-700 rounded" onClick={setToday}>
            Today
          </button>
          <button className="px-3 py-2 bg-neutral-700 rounded" onClick={setThisWeek}>
            This week
          </button>
          <button className="px-3 py-2 bg-neutral-700 rounded" onClick={setThisMonth}>
            This month
          </button>
        </div>

        <div className="flex gap-2 items-center">
          Date range:
          <input type="date" className="px-3 py-2 rounded bg-neutral-700" max={endDateInput} value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} /> -
          <input type="date" className="px-3 py-2 rounded bg-neutral-700" min={startDateInput} value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} />
          <button className="px-3 py-2 bg-neutral-700 rounded" onClick={() => changeDateRange(startDateInput, endDateInput)}>Filter</button>
        </div>
      </div>

      <h2 className="text-2xl my-2">Matches {formatDate(new Date()) === startDate ? "for today" : `from ${startDate} to ${endDate}`}</h2>

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
  );
}