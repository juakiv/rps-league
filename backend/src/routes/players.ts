import { Router } from "express";
import { eq, or, sql } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";
import { paginate } from "../utils/pagination";

const playersRouter = Router();

playersRouter.get("/:name", async (req, res) => {
  const { name } = req.params;
  const { page = "1", pageSize = "20" } = req.query;
  
  const playerMatches = db
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
      or(
        eq(matchesTable.player_a_name, name),
        eq(matchesTable.player_b_name, name)
      )
    )
    .orderBy(sql`timestamp DESC`);

  const result = await paginate(db, playerMatches, parseInt(page as string), parseInt(pageSize as string));
  return res.json(result);
});

export default playersRouter;