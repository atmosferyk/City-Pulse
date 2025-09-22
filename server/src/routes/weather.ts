import { Router } from "express";
import { z } from "zod";

const r = Router();
const Q = z.object({
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  tz: z.string().default("Europe/Warsaw"),
});

r.get("/", async (req, res) => {
  try {
    const { lat, lon, tz } = Q.parse(req.query);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&timezone=${encodeURIComponent(tz)}` +
      `&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code,relative_humidity_2m,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code`;

    const resp = await fetch(url);  // ✅ global fetch
    if (!resp.ok) return res.status(502).json({ error: true, status: resp.status });
    res.json(await resp.json());
  } catch (e: any) {
    res.status(400).json({ error: true, message: e?.message ?? "Bad request" });
  }
});

export default r;
