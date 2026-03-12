import "./config/env";

import express from "express";
import cors from "cors";

import matchesRouter from "./routes/matches";
import { ingestHistory } from "./services/ingestor";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/heartbeat", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/matches", matchesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ingestHistory();
});