import { History } from "../types.js";

export async function fetchHistory(cursor: string | null): Promise<History> {
  let retryCount = 0;

  const response = await fetch(`${process.env.REAKTOR_API_URL}/history${cursor ? `?cursor=${cursor}` : ""}`, {
    headers: {
      Authorization: `Bearer ${process.env.REAKTOR_API_KEY}`,
    }
  });

  if(response.ok) {
    return response.json();
  }

  if(response.status === 429) {
    let retryAfter = response.headers.get("Retry-After");
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      if (!isNaN(retryAfterSeconds)) {
        console.warn(`Rate limited. Retrying after ${retryAfterSeconds} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
        return fetchHistory(cursor);
      }
    }
  }

  // in case of server error (5xx), we can retry a few times with exponential backoff
  if(response.status >= 500 && response.status < 600 && retryCount < 5) {
    retryCount++;
    
    const backoffTime = Math.pow(2, retryCount) * 1000;
    console.warn(`Server error (${response.status}). Retrying in ${backoffTime / 1000} seconds...`);

    await new Promise(resolve => setTimeout(resolve, backoffTime));
    return fetchHistory(cursor);
  }

  throw new Error(`Failed to fetch history: ${response.status} ${response.statusText}`);
}