import "dotenv/config";

import { matchesTable } from "../db/schema";
import { db } from "../db/db";

import { normalizeMatch } from "../utils/normalizeMatch";

let isConnected = false;
let isRunning = false;

async function connectToLiveMatches() {
  console.log("Starting live matches ingestion...");
  const response = await fetch(`${process.env.REAKTOR_API_URL}/live`, {
    headers: {
      Authorization: `Bearer ${process.env.REAKTOR_API_KEY}`,
      Accept: "text/event-stream"
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to connect to live matches: ${response.statusText}`);
  }

  isConnected = true;

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (isRunning) {
    const result = await reader.read();

    if (result.done) {
      console.warn("Live matches stream closed by server.");
      break;
    }

    buffer += decoder.decode(result.value, { stream: true });

    let lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const json = line.slice(6);
        try {
          const match = JSON.parse(json);
          const normalizedMatch = normalizeMatch(match, null);

          await db.insert(matchesTable).values(normalizedMatch).onConflictDoNothing();
          console.log(`Ingested live match: ${normalizedMatch.game_id}`);
        } catch (err) {
          console.error("Failed to parse live match update:", err);
        }
      }
    }
  }

  isConnected = false;
  console.log("Stopped live matches ingestion.");
}

export function startLiveMatchesIngestion() {
  if (!isRunning) {
    isRunning = true;
    try {
      connectToLiveMatches();
    } catch (err) {
      isConnected = false;
      console.error("Error starting live matches ingestion:", err);
    }
  }
}