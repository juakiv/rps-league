import { Router } from "express";
import { eq, or, sql } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";
import { paginate } from "../utils/pagination";

const playersRouter = Router();

playersRouter.get("/:name", async (req, res) => {
  const { name } = req.params;
  const { page = "1", pageSize = "20" } = req.query;
  
  const playerMatches = db.select()
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