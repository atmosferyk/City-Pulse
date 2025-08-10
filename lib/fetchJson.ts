export async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => url)}`);
    }
    return res.json() as Promise<T>;
  }
  