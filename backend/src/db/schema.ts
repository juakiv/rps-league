import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel } from "drizzle-orm/table";

export const matchesTable = sqliteTable("matches_table", {
  game_id: text("game_id").primaryKey(),
  timestamp: int("timestamp").notNull(),
  player_a_name: text("player_a_name").notNull(),
  player_a_move: text("player_a_move").notNull(),
  player_b_name: text("player_b_name").notNull(),
  player_b_move: text("player_b_move").notNull(),
  winner: text("winner"),
});

export type NewMatch = InferInsertModel<typeof matchesTable>;