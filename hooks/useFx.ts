import { getNbpRates, type NbpRate } from "@/lib/nbp";
import { useCallback, useEffect, useState } from "react";

export function useFx(codes: string[] = ["USD", "EUR", "GBP"]) {
    const [data, setData] = useState<NbpRate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const asOf = data?.[0]?.effectiveDate ?? null;

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const out = await getNbpRates(codes);
            setData(out);
        } catch (e: any) {
            setError(e?.message ?? String(e));
        }
    }, [codes.join("|")]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { data, loading, error, asOf, refresh };
}