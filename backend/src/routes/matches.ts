import { Router } from "express";
import { and, gte, lte, sql } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { getDayRange } from "../utils/getDayRange";
import { paginate } from "../utils/pagination";

const matchesRouter = Router();

// latest matches. add live!
matchesRouter.get("/", async (req, res) => {
  const { page = "1", pageSize = "20" } = req.query;
  const matches = db
    .select({
      game_id: matchesTable.game_id,
      timestamp: matchesTable.timestamp,
      player_a_name: matchesTable.player_a_name,
      player_a_move: matchesTable.player_a_move,
      player_b_name: matchesTable.player_b_name,
      player_b_move: matchesTable.player_b_move,
      winner: matchesTable.winner,
    })
    .from(matchesTable)
    .orderBy(sql`timestamp DESC`);

  const result = await paginate(db, matches, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

// matches by date
matchesRouter.get("/:date", async (req, res) => {
  const { date } = req.params;
  const { page = "1", pageSize = "20" } = req.query;

  const { start, end } = getDayRange(new Date(date));

  const matches = db
    .select({
      game_id: matchesTable.game_id,
      timestamp: matchesTable.timestamp,
      player_a_name: matchesTable.player_a_name,
      player_a_move: matchesTable.player_a_move,
      player_b_name: matchesTable.player_b_name,
      player_b_move: matchesTable.player_b_move,
      winner: matchesTable.winner,
    })
    .from(matchesTable)
    .where(
      and(
        gte(matchesTable.timestamp, start),
        lte(matchesTable.timestamp, end)
      )
    )
    .orderBy(sql`timestamp DESC`);

  const result = await paginate(db, matches, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

export default matchesRouter;