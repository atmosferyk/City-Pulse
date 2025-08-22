import { useCityStore } from "@/hooks/useCityStore";
import { getAirByCoords, type AirData } from "@/lib/air";
import { useEffect, useState } from "react";

export function useAir() {
  const city = useCityStore((s) => s.city);
  const [data, setData] = useState<AirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setError(null);
    getAirByCoords(city.latitude, city.longitude)
      .then(setData)
      .catch((e) => setError(e?.message ?? "Air fetch failed"))
      .finally(() => setLoading(false));
  }, [city?.latitude, city?.longitude]);

  return { data, loading, error, city };
}
