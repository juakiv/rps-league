import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import APIFetch from "../utils/APIFetch";

import { SkeletonRow } from "../components/Skeleton";
import { useSearchParams } from "react-router";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function Leaderboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParams.get("startDate") || formatDate(new Date());
  const endDate = searchParams.get("endDate") || formatDate(new Date());

  const [startDateInput, setStartDateInput] = useState(startDate);
  const [endDateInput, setEndDateInput] = useState(endDate);

  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["leaderboard", startDate, endDate],
    queryFn: () => APIFetch(`/api/leaderboard?pageSize=30&startDate=${startDate}&endDate=${endDate}`),
    refetchInterval: 10000,
  });

  const changeDateRange = (newStartDate: string, newEndDate: string) => {
    setSearchParams({ startDate: newStartDate, endDate: newEndDate });
    setStartDateInput(newStartDate);
    setEndDateInput(newEndDate);
  };

  const setToday = () => changeDateRange(formatDate(new Date()), formatDate(new Date()));

  const setThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    changeDateRange(formatDate(monday), formatDate(sunday));
  };

  const setThisMonth = () => {
    const now = new Date();

    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    changeDateRange(formatDate(first), formatDate(last));
  };

  const firstPlace = data?.data[0] || null;
  const secondPlace = data?.data[1] || null;
  const thirdPlace = data?.data[2] || null;
  const others = data?.data.slice(3) || [];

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
          <input type="date" className="px-3 py-2 rounded bg-neutral-700" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} /> -
          <input type="date" className="px-3 py-2 rounded bg-neutral-700" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} />
          <button className="px-3 py-2 bg-neutral-700 rounded" onClick={() => changeDateRange(startDateInput, endDateInput)}>Filter</button>
        </div>
      </div>

      <h2 className="text-2xl my-2">Leaderboard {formatDate(new Date()) === startDate ? "for today" : `from ${startDate} to ${endDate}`}</h2>
      <div className="flex flex-row items-end gap-2 mb-4">
        <div className="flex-1 bg-slate-400/40 p-4 rounded my-4 h-60 items-center justify-center flex flex-col">
          <div className="text-4xl">🥈</div>
          <h2 className="text-2xl font-bold">{secondPlace?.player || "..."}</h2>
          <p>{secondPlace?.wins || "0"} wins</p>
        </div>
        <div className="flex-1 bg-yellow-400/40 p-4 rounded my-4 h-80 items-center justify-center flex flex-col">
          <div className="text-4xl">🥇</div>
          <h2 className="text-2xl font-bold">{firstPlace?.player || "..."}</h2>
          <p>{firstPlace?.wins || "0"} wins</p>
        </div>
        <div className="flex-1 bg-amber-800/40 p-4 rounded my-4 h-50 items-center justify-center flex flex-col">
          <div className="text-4xl">🥉</div>
          <h2 className="text-2xl font-bold">{thirdPlace?.player || "..."}</h2>
          <p>{thirdPlace?.wins || "0"} wins</p>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-600 rounded">
        <div className="flex flex-row px-4 py-2 bg-neutral-700 rounded-t">
          <div className="font-bold w-20">Rank</div>
          <div className="font-bold flex-1">Name</div>
          <div className="font-bold flex-1">Wins</div>
        </div>
        {error && (
          <div className="p-4 text-red-500 text-center">
            Failed to load leaderboard: {error.message}
          </div>
        )}
        {isFetching && !data && (
          <>
            {Array.from({ length: 30 }).map((_, i) => <SkeletonRow key={i} i={i} />)}
          </>
        )}
        <AnimatePresence initial={false}>
          {others.map((match: any, index: number) => (
            <motion.div
              key={match.game_id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-row px-4 py-2 border-t border-neutral-600"
            >
              <div className="w-20">{index + 4}</div>
              <div className="flex-1">{match.player}</div>
              <div className="flex-1">{match.wins}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}