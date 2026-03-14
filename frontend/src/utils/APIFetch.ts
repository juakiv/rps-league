export default async function APIFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`)
  }

  return res.json() as Promise<T>;
}