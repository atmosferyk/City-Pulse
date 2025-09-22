import { Router } from "express";
import { z } from "zod";

const r = Router();
const Q = z.object({
  lat: z.coerce.number(),
  lon: z.coerce.number(),
});

r.get("/", async (req, res) => {
  try {
    const { lat, lon } = Q.parse(req.query);
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
      `&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone`;

    const resp = await fetch(url);  // ✅ global fetch
    if (!resp.ok) return res.status(502).json({ error: true, status: resp.status });
    res.json(await resp.json());
  } catch (e: any) {
    res.status(400).json({ error: true, message: e?.message ?? "Bad request" });
  }
});

export default r;
