import { fetchRetry } from "../utils/fetchRetry";
import { fetchHistory } from "./history";

import { db } from "../db/db";
import { matchesTable, NewMatch } from "../db/schema";

/*
 * todo:
 * - only ingest until we reach the last ingested match
 */
export async function ingestHistory() {
  let cursor: string | null = null;
  let totalMatches = 0;
  let i = 0;

  // temporary test
  while(i < 10) {
    let history;

    try {
      history = await fetchRetry(() => fetchHistory(cursor), 5);
    } catch (err) {
      console.error("Failed to ingest history:", err);
      break;
    }

    console.log(`Fetched ${history.data.length} matches (cursor: ${history.cursor})`);

    if(history.data.length > 0) {
      const rows: NewMatch[] = history.data.map(match => ({
        game_id: match.gameId,
        timestamp: match.time,
        player_a_name: match.playerA.name,
        player_a_move: match.playerA.played as string,
        player_b_name: match.playerB.name,
        player_b_move: match.playerB.played as string,
        winner: match.winner as string ?? null,
      }));

      await db.insert(matchesTable).values(rows).onConflictDoNothing();
    }

    totalMatches += history.data.length;
    cursor = history.cursor?.split("cursor=")[1] || null;
    i++;

    if (!history.cursor) {
      console.log("No more data to fetch.");
      break;
    }
  }
  console.log(`Total matches ingested: ${totalMatches}`);
}