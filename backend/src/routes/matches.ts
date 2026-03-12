import { Router } from "express";
import { and, asc, gte, lte } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDayRange } from "../utils/getDayRange";

const matchesRouter = Router();

matchesRouter.get("/", (_req, res) => {
  res.json({ message: "Matches endpoint" });
});

matchesRouter.get("/:date", async (req, res) => {
  const { date } = req.params;
  const { start, end } = getDayRange(new Date(date));

  await db
    .select()
    .from(matchesTable)
    .where(
      and(
        gte(matchesTable.timestamp, start),
        lte(matchesTable.timestamp, end)
      )
    )
    .orderBy(asc(matchesTable.timestamp))
    .then(matches => {
      res.json(matches);
    }).catch(err => {
      console.error("Failed to fetch matches:", err);
      res.status(500).json({ error: "Failed to fetch matches" });
    });
});

export default matchesRouter;