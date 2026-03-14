import { Router } from "express";
import { and, asc, gte, lte } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDayRange } from "../utils/getDayRange";
import { paginate } from "../utils/pagination";

const matchesRouter = Router();

// latest matches. add live!
matchesRouter.get("/", async (req, res) => {
  const { page = "1", pageSize = "20" } = req.query;
  const matches = db.select().from(matchesTable).orderBy(asc(matchesTable.timestamp));

  const result = await paginate(db, matches, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

// matches by date
matchesRouter.get("/:date", async (req, res) => {
  const { date } = req.params;
  const { page = "1", pageSize = "20" } = req.query;

  const { start, end } = getDayRange(new Date(date));

  const matches = db
    .select()
    .from(matchesTable)
    .where(
      and(
        gte(matchesTable.timestamp, start),
        lte(matchesTable.timestamp, end)
      )
    )
    .orderBy(asc(matchesTable.timestamp));

  const result = await paginate(db, matches, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

export default matchesRouter;