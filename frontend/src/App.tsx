import { Link, Route, Routes } from "react-router";

import Home from "./views/Home";

export default function App() {
  return (
    <>
      <nav className="bg-neutral-800 py-4">
        <div className="flex justify-between items-center container mx-auto">
          <Link href="/" className="text-xl font-bold">RPS League</Link>
          <div>
            <a href="#" className="px-3 py-2 rounded hover:bg-neutral-700">
              Matches
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-neutral-700">
              Leaderboard
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto my-4">
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </main>
    </>
  )
}