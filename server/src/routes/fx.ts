import { Router } from "express";
import { z } from "zod";

const r = Router();
const Q = z.object({ codes: z.string().default("USD,EUR,GBP") });

r.get("/", async (req, res) => {
  try {
    const { codes } = Q.parse(req.query);
    const list = codes.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

    const out = await Promise.all(
      list.map(async (code) => {
        const url = `https://api.nbp.pl/api/exchangerates/rates/A/${encodeURIComponent(code)}?format=json`;
        const resp = await fetch(url);            
        if (!resp.ok) throw new Error(`NBP ${code} ${resp.status}`);
        const json: any = await resp.json();
        const last = json?.rates?.[0];
        return {
          code,
          pair: `${code}/PLN`,
          value: last?.mid ?? null,
          effectiveDate: last?.effectiveDate ?? null,
        };
      })
    );

    res.json(out);
  } catch (e: any) {
    res.status(400).json({ error: true, message: e?.message ?? "Bad request" });
  }
});

export default r;
