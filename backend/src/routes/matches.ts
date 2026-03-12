import { Router } from "express";
import { and, asc, gte, lte } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDayRange } from "../utils/getDayRange";

const matchesRouter = Router();

// add pagination to all endpoints that return multiple matches
// maybe make a reusable paginator util
// move business logic to controllers

matchesRouter.get("/", async (_req, res) => {
  const matches = await db.select().from(matchesTable).orderBy(asc(matchesTable.timestamp));
  res.json(matches);
});

matchesRouter.get("/:date", async (req, res) => {
  const { date } = req.params;
  const { start, end } = getDayRange(new Date(date));

  const matches = await db
    .select()
    .from(matchesTable)
    .where(
      and(
        gte(matchesTable.timestamp, start),
        lte(matchesTable.timestamp, end)
      )
    )
    .orderBy(asc(matchesTable.timestamp));

  return res.json(matches);
});

export default matchesRouter;