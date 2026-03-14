import "./config/env";

import express from "express";
import cors from "cors";

import matchesRouter from "./routes/matches";
import { ingestHistory } from "./services/ingestor";
import leaderboardRouter from "./routes/leaderboard";
import playersRouter from "./routes/players";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/heartbeat", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/matches", matchesRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/players", playersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ingestHistory();
});