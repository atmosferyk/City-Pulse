import { useCityStore } from "@/hooks/useCityStore";
import { useEffect, useState } from "react";

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt?: string; // ISO
};

export function useNews() {
  const city = useCityStore((s) => s.city);
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MOCK: Replace with real fetch later
  useEffect(() => {
    setLoading(true);
    setError(null);

    const name = city?.name ?? "Polska";
    const now = new Date().toISOString();
    const mock: NewsItem[] = [
      {
        id: "1",
        title: `Wydarzenia w regionie: ${name}`,
        source: "CityPulse",
        url: "https://example.com/1",
        publishedAt: now,
      },
      {
        id: "2",
        title: `${name}: komunikaty i najważniejsze informacje`,
        source: "CityPulse",
        url: "https://example.com/2",
        publishedAt: now,
      },
      {
        id: "3",
        title: `Co słychać w ${name}? Podsumowanie dnia`,
        source: "CityPulse",
        url: "https://example.com/3",
        publishedAt: now,
      },
    ];

    const timer = setTimeout(() => {
      setData(mock);
      setLoading(false);
    }, 400); // simulate latency

    return () => clearTimeout(timer);
  }, [city?.name]);

  const refresh = async () => {
    // call the same logic; when you switch to real API, fetch here
    setLoading(true);
    setError(null);
    try {
      // await fetch real data here later
      setLoading(false);
    } catch (e: any) {
      setError(e?.message ?? "Błąd pobierania wiadomości");
      setLoading(false);
    }
  };

  return { data, loading, error, refresh, city };
}
