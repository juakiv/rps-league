import { fetchRetry } from "../utils/fetchRetry";
import { fetchHistory } from "./history";

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