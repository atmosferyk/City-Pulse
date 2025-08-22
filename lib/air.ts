import { fetchJson } from "@/lib/fetchJson";

type OMairCurrent = {
  us_aqi: number;
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null; // NO2
  ozone: number | null;            // O3
};

export type AirData = {
  aqi: number;
  category:
    | "Good"
    | "Moderate"
    | "Unhealthy for SG"
    | "Unhealthy"
    | "Very Unhealthy"
    | "Hazardous";
  pm25?: number | null;
  pm10?: number | null;
  no2?: number | null;
  o3?: number | null;
};

function aqiCategory(aqi: number): AirData["category"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for SG";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export async function getAirByCoords(
  lat: number,
  lon: number
): Promise<AirData | null> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone`; // <-- FIXED

  const res = await fetchJson<{ current: OMairCurrent }>(url);
  if (!res?.current || typeof res.current.us_aqi !== "number") return null;

  return {
    aqi: res.current.us_aqi,
    category: aqiCategory(res.current.us_aqi),
    pm25: res.current.pm2_5,
    pm10: res.current.pm10,
    no2: res.current.nitrogen_dioxide, // map to your keys
    o3: res.current.ozone,
  };
}
