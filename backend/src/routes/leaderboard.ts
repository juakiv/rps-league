import { and, gte, isNotNull, lte, notInArray, sql } from "drizzle-orm";
import { Router } from "express";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDatesRange } from "../utils/getDatesRange";
import { paginate } from "../utils/pagination";

const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res) => {
  let page = Number(req.query.page ?? 1);
  let pageSize = Number(req.query.pageSize ?? 20);
  let startDateStr = String(req.query.startDate ?? new Date().toISOString().split('T')[0]);
  let endDateStr = String(req.query.endDate ?? new Date().toISOString().split('T')[0]);

  if(!Number.isInteger(page) || page < 1) page = 1;
  if(!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 20;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return res.status(400).json({ error: "Invalid date format" });
  if(startDate > endDate) return res.status(400).json({ error: "startDate cannot be after endDate" });

  const { start, end } = getDatesRange(startDate, endDate);

  const leaderboard = db
    .select({
      player: sql<string>`CASE
        WHEN ${matchesTable.winner} = 'A' THEN ${matchesTable.player_a_name}
        WHEN ${matchesTable.winner} = 'B' THEN ${matchesTable.player_b_name}
        ELSE 'Unknown Player'
      END`.as("player"),
      wins: sql<number>`count(*)`.as("wins"),
    })
    .from(matchesTable)
    .where(
      and(
        isNotNull(matchesTable.winner),
        notInArray(matchesTable.winner, ["DRAW"]),
        gte(matchesTable.timestamp, start),
        lte(matchesTable.timestamp, end)
      )
    )
    .groupBy(sql`player`)
    .orderBy(sql`wins DESC`, sql`lower(player) ASC`);

  const result = await paginate(db, leaderboard, page, pageSize);
  return res.json(result);
});

export default leaderboardRouter;