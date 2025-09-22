import cors from "cors";
import express from "express";
import airRouter from "./routes/air.js";
import fxRouter from "./routes/fx.js";
import weatherRouter from "./routes/weather.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" })); // tighten later if you like

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/fx",      fxRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/air",     airRouter);

console.log("Booting server index.ts");
console.log("PORT env =", process.env.PORT);
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
