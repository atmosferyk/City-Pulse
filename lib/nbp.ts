import { fetchJson } from "./fetchJson";

type NbpSingleResponse = {
    code: string; // "USD"
    rates: Array<{ effectiveDate: string; mid: number }>;
  };

export type NbpRate = {
    code: string,
    pair: string, 
    value: number,
    effectiveDate: string,
}

async function fetchOne(code: string): Promise<NbpRate> {
    const url = `https://api.nbp.pl/api/exchangerates/rates/A/${encodeURIComponent(code)}?format=json`;
    const data = await fetchJson<NbpSingleResponse>(url);
    const table = Array.isArray(data.rates) ? data.rates : [];

    if(table.length === 0) {
        throw new Error(`No data for ${data.code}`);
    }

    return {
        code: data.code, 
        pair: `${data.code}/PLN`,
        value: table[0].mid,
        effectiveDate: table[0].effectiveDate,
    }
}

export async function getNbpRates(codes: string[]): Promise<NbpRate[]> {
    return Promise.all(codes.map((c) => fetchOne(c)));
}