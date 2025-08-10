import { useCityStore } from "@/hooks/useCityStore";
import { getWeather, type OMResponse } from "@/lib/openMeteo";
import { useEffect, useRef, useState } from "react";

export function useWeather() {
  const city = useCityStore((s) => s.city);
  const [data, setData] = useState<OMResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (!city) return;
    const my = ++seq.current;
    const ctl = new AbortController();

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getWeather(city.latitude, city.longitude, city.timezone ?? "Europe/Warsaw");
        if (seq.current !== my) return;
        setData(res);
      } catch (e: any) {
        if (ctl.signal.aborted) return;
        if (seq.current === my) setError(e?.message ?? "Weather fetch failed");
      } finally {
        if (seq.current === my) setLoading(false);
      }
    })();

    return () => {
      ctl.abort();
    };
  }, [city?.latitude, city?.longitude, city?.timezone]);

  return { data, loading, error, city };
}
