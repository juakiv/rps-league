export async function fetchRetry<T>(fetcher: () => Promise<T>, retries: number): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fetcher();
    } catch (err) {
      if (attempt >= retries) {
        throw new Error(`Failed after ${retries} retries: ${err instanceof Error ? err.message : String(err)}`);
      }

      attempt++;

      const delay = attempt * 500;
      console.warn(`Retry ${attempt}/${retries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}