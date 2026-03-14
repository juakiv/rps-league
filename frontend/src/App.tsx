import { Link, Route, Routes } from "react-router";

import Home from "./views/Home";
import Leaderboard from "./views/Leaderboard";
import PlayerProfile from "./views/PlayerProfile";
import Matches from "./views/Matches";

export default function App() {
  return (
    <>
      <nav className="bg-neutral-800 py-4">
        <div className="flex justify-between items-center w-260 mx-auto">
          <Link to="/" className="text-xl font-bold">RPS League</Link>
          <div>
            <Link to="/" className="px-3 py-2 rounded hover:bg-neutral-700">Homepage</Link>
            <Link to="/matches" className="px-3 py-2 rounded hover:bg-neutral-700">Matches</Link>
            <Link to="/leaderboard" className="px-3 py-2 rounded hover:bg-neutral-700">Leaderboard</Link>
          </div>
        </div>
      </nav>
      <main className="w-260 mx-auto my-4">
        <Routes>
          <Route index element={<Home />} />
          
          <Route path="/matches" element={<Matches />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/players/:name" element={<PlayerProfile />} />
        </Routes>
      </main>
    </>
  )
}