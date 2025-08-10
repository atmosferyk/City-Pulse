import { useEffect, useState } from "react";

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  admin1?: string | null;
  admin2?: string | null;
  timezone?: string | null;
  label: string;
};

export function useCitySearch(query: string) {
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    const t = setTimeout(() => {
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          q
        )}&count=6&language=pl&format=json`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const cities: City[] = (data.results ?? [])
            .filter((r: any) => r.country_code === "PL")
            .map((r: any) => ({
              name: r.name,
              latitude: r.latitude,
              longitude: r.longitude,
              countryCode: r.country_code,
              admin1: r.admin1 ?? null,
              admin2: r.admin2 ?? null,
              timezone: r.timezone ?? null,
              label: r.admin1
                ? `${r.name}, ${r.admin1}`
                : r.admin2
                ? `${r.name}, ${r.admin2}`
                : r.name,
            }));
          setResults(cities);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250); // debounce typing

    return () => clearTimeout(t);
  }, [query]);

  return { results, loading, error };
}
