import { Router } from "express";
import { and, gte, lte, sql } from "drizzle-orm";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { paginate } from "../utils/pagination";
import { getDatesRange } from "../utils/getDatesRange";

const matchesRouter = Router();

matchesRouter.get("/", async (req, res) => {
  let page = Number(req.query.page ?? 1);
  let pageSize = Number(req.query.pageSize ?? 20);
  let startDateStr = String(req.query.startDate ?? new Date("2026-01-01").toISOString().split('T')[0]);
  let endDateStr = String(req.query.endDate ?? new Date().toISOString().split('T')[0]);

  if(!Number.isInteger(page) || page < 1) page = 1;
  if(!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 20;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return res.status(400).json({ error: "Invalid date format" });
  if(startDate > endDate) return res.status(400).json({ error: "startDate cannot be after endDate" });

  const { start, end } = getDatesRange(startDate, endDate);

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

  const result = await paginate(db, matches, page, pageSize);
  return res.json(result);
});

export default matchesRouter;