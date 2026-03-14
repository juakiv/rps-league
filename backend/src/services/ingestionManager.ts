import { ingestHistory } from "./ingestor.js";
import { isLiveIngestionConnected, startLiveMatchesIngestion } from "./liveMatches.js";

export default function startIngestion() {
  ingestHistory();
  startLiveMatchesIngestion();
  
  // if live ingestation stops, try to restart it after a delay
  setInterval(() => {
    if (!isLiveIngestionConnected()) {
      console.warn("Live matches ingestion is not connected. Attempting to restart...");
      startLiveMatchesIngestion();
    } else {
      console.log("Live matches ingestion is healthy.");
    }
  }, 60000);

  // run full history ingestion every hour
  setInterval(() => {
    console.log("Starting scheduled history ingestion...");
    ingestHistory();
  }, 60 * 60 * 1000);
}