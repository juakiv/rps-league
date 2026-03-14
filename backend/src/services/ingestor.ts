import { isNotNull, sql } from "drizzle-orm";

import { db } from "../db/db";
import { matchesTable, NewMatch } from "../db/schema";

import { normalizeMatch } from "../utils/normalizeMatch";

import { fetchHistory } from "./history";

async function getLastIngestedCursor(): Promise<string | null> {
  const lastMatch = await db
    .select({ cursor: matchesTable.cursor })
    .from(matchesTable)
    .where(isNotNull(matchesTable.cursor))
    .orderBy(sql`timestamp DESC`)
    .limit(1)
    .execute();

  if (lastMatch.length === 0) {
    return null;
  }

  return lastMatch[0].cursor;
}

/*
 * cursor seems to be stable so we can use it to keep track of last ingested page.
 * so we can stop fetching more pages once we encounter the last ingested cursor.
 */
export async function ingestHistory() {
  let cursor: string | null = null;
  let totalMatches = 0;
  let lastIngestedCursor: string | null = await getLastIngestedCursor();

  console.log(`Starting ingestion. Last ingested cursor: ${lastIngestedCursor}.`);

  while(lastIngestedCursor === null || cursor !== lastIngestedCursor) {
    let history;

    try {
      history = await fetchHistory(cursor);
    } catch (err) {
      console.error("Failed to ingest history:", err);
      break;
    }

    console.log(`Fetched ${history.data.length} matches (next cursor: ${history.cursor}, current cursor: ${cursor})`);

    if(history.data.length > 0) {
      const rows: NewMatch[] = history.data.map(match => normalizeMatch(match, history.cursor));
      await db.insert(matchesTable).values(rows).onConflictDoNothing();
    }

    totalMatches += history.data.length;
    cursor = history.cursor?.split("cursor=")[1] || null;

    if (!history.cursor) {
      console.log("No more data to fetch.");
      break;
    }
  }
  console.log(`Total matches ingested: ${totalMatches}`);
}