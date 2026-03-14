import { and, gte, isNotNull, lt, notInArray, sql } from "drizzle-orm";
import { Router } from "express";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDatesRange } from "../utils/getDatesRange";
import { paginate } from "../utils/pagination";

const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res) => {
  const { page = "1", pageSize = "20", startDate = new Date(), endDate = new Date() } = req.query;
  const { start, end } = getDatesRange(new Date(startDate as string), new Date(endDate as string));

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
        lt(matchesTable.timestamp, end)
      )
    )
    .groupBy(sql`player`)
    .orderBy(sql`wins DESC`, sql`lower(player) ASC`);

  const result = await paginate(db, leaderboard, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

export default leaderboardRouter;