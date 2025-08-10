import { fetchJson } from "@/lib/fetchJson";

export type OMCurrent = {
  temperature_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  weather_code: number;
  relative_humidity_2m: number;
  precipitation: number;      
};

export type OMDaily = {
  time: string[];                 // ISO dates
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];            
  precipitation_probability_max: number[];
  weather_code: number[];
};

export type OMResponse = {
  current: OMCurrent;
  daily: OMDaily;
  timezone: string;
};

export async function getWeather(lat: number, lon: number, tz = "Europe/Warsaw") {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&timezone=${encodeURIComponent(tz)}` +
      `&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code,relative_humidity_2m,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code`;
    return fetchJson<OMResponse>(url);
  }
