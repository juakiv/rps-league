import { useQuery } from "@tanstack/react-query";

import APIFetch from "../utils/APIFetch";

export default function Leaderboard() {
  const { data, isFetching, error }: { data: any; isFetching: boolean; error: any } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => APIFetch(`/api/leaderboard`)
  });

  const firstPlace = data?.data[0] || null;
  const secondPlace = data?.data[1] || null;
  const thirdPlace = data?.data[2] || null;

  return (
    <>
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
    </>
  );
}