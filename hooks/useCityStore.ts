import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  admin1?: string | null;
  admin2?: string | null;
  timezone?: string | null;
  label: string;
};

type CityState = {
  city: City | null;
  setCity: (c: City | null) => void;
};

// 1) Make a vanilla store (NOT a hook)
export const cityStore = createStore<CityState>()((set) => ({
  city: null,
  setCity: (c) => set({ city: c }),
}));

// 2) Export a React hook that uses that store
export function useCityStore<T>(selector: (s: CityState) => T): T {
  return useStore(cityStore, selector);
}

