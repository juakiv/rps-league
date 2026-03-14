import { Route, Routes } from "react-router";

export default function App() {
  return (
    <>
      <nav className="bg-neutral-800 py-4">
        <div className="flex justify-between items-center container mx-auto">
          <div className="text-xl font-bold">RPS League</div>
          <div>
            <a href="#" className="px-3 py-2 rounded hover:bg-neutral-700">
              Home
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-neutral-700">
              Players
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-neutral-700">
              Matches
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto">
        <Routes>
          <Route index element={<>abc</>} />
        </Routes>
      </main>
    </>
  )
}