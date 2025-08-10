import type { City } from "@/constants/types";
import { fetchJson } from "./fetchJson";

type OpenMeteoGeoResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
    admin1?: string;
    admin2?: string;
    timezone?: string;
  }>;
};

export async function searchCitiesPL(q: string, limit = 6): Promise<City[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}` +
    `&count=${limit}&language=pl&format=json`;
  const data = await fetchJson<OpenMeteoGeoResponse>(url);

  const list = (data.results ?? []).filter(r => r.country_code === "PL");
  return list.map(r => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    countryCode: r.country_code,
    admin1: r.admin1 ?? null,
    admin2: r.admin2 ?? null,
    timezone: r.timezone ?? null,
    label: r.admin1 ? `${r.name}, ${r.admin1}` :
           r.admin2 ? `${r.name}, ${r.admin2}` : r.name,
  }));
}
