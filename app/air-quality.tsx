import { useAir } from "@/hooks/useAir";
import { useCityStore } from "@/hooks/useCityStore";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function tagColor(category?: string) {
  switch (category) {
    case "Good": return "#10B981";
    case "Moderate": return "#F59E0B";
    case "Unhealthy for SG": return "#F97316";
    case "Unhealthy": return "#EF4444";
    case "Very Unhealthy": return "#8B5CF6";
    case "Hazardous": return "#7F1D1D";
    default: return "#374151";
  }
}

function polishCategory(category?: string) {
  switch (category) {
    case "Good": return "Dobra";
    case "Moderate": return "Umiarkowana";
    case "Unhealthy for SG": return "Niezdrowa (wrażliwi)";
    case "Unhealthy": return "Niezdrowa";
    case "Very Unhealthy": return "Bardzo niezdrowa";
    case "Hazardous": return "Niebezpieczna";
    default: return "Brak danych";
  }
}

const DESCRIPTIONS: Record<string, string> = {
  AQI: "US AQI (0–500) to wskaźnik ogólnej jakości powietrza. Wyższa wartość = gorsza jakość. Wskaźnik bazuje na najgorszym z głównych zanieczyszczeń w danym momencie.",
  "PM2.5":
    "Drobny pył zawieszony o średnicy ≤2.5µm. Dociera głęboko do płuc; powiązany z chorobami układu krążenia i oddechowego.",
  PM10:
    "Pył o średnicy ≤10µm. Podrażnia oczy, nos i gardło; pochodzi m.in. z ruchu drogowego, kurzu, budów.",
  "NO₂":
    "Dwutlenek azotu. Głównie emisje z transportu i spalania. Podrażnia drogi oddechowe i nasila objawy astmy.",
  "O₃":
    "Ozon przygruntowy powstaje z udziałem światła słonecznego i innych zanieczyszczeń. Podrażnia płuca i obniża wydolność oddechową.",
  Units:
    "Stężenia podajemy w µg/m³ (mikrogramy na metr sześcienny). Im niższe wartości, tym lepiej.",
};

export default function AirScreen() {
  const { data, loading, error } = useAir();
  const city = useCityStore((s) => s.city);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => setOpenKey((k) => (k === key ? null : key));

  return (
    <SafeAreaView style={st.safe}>
      <ScrollView contentContainerStyle={st.content}>
        <Text style={st.title}>{city?.name ?? "Jakość powietrza"}</Text>

        {loading && <Text style={st.muted}>Ładowanie…</Text>}
        {error && <Text style={st.err}>Błąd: {error}</Text>}

        {!loading && !error && data && (
          <>
            {/* AQI summary */}
            <View style={st.box}>
              <View style={st.rowHead}>
                <Text style={st.big}>AQI {data.aqi}</Text>
                <View
                  style={[
                    st.chip,
                    { backgroundColor: tagColor(data.category) },
                  ]}
                >
                  <Text style={st.chipText}>{polishCategory(data.category)}</Text>
                </View>
              </View>

              <Pressable onPress={() => toggle("AQI")} style={st.helpTap}>
                <Text style={st.helpTapText}>Co to jest AQI?</Text>
              </Pressable>
              {openKey === "AQI" && (
                <Text style={st.note}>{DESCRIPTIONS.AQI}</Text>
              )}
            </View>

            {/* Concentrations */}
            <Text style={st.sub}>Stężenia (µg/m³)</Text>
            <Text style={st.noteMini}>{DESCRIPTIONS.Units}</Text>

            <View style={st.table}>
              {[
                ["PM2.5", data.pm25],
                ["PM10", data.pm10],
                ["NO₂", data.no2],
                ["O₃", data.o3],
              ].map(([label, val]) => {
                const key = label as string;
                return (
                  <View key={key} style={st.metricBlock}>
                    <Pressable
                      onPress={() => toggle(key)}
                      style={({ pressed }) => [
                        st.row,
                        pressed && { backgroundColor: "#151515" },
                      ]}
                    >
                      <Text style={st.cellL}>{key}</Text>
                      <Text style={st.cellR}>{val == null ? "—" : val}</Text>
                    </Pressable>
                    {openKey === key && (
                      <Text style={st.note}>{DESCRIPTIONS[key]}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { padding: 16, gap: 16 },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  sub: { color: "#D1D5DB", fontSize: 16, fontWeight: "700" },
  big: { color: "white", fontSize: 32, fontWeight: "800" },
  rowHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: { borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  chipText: { color: "white", fontSize: 12, fontWeight: "700" },
  box: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    padding: 16,
    gap: 6,
  },
  table: { gap: 8 },
  metricBlock: { gap: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cellL: { color: "#D1D5DB", fontSize: 14, fontWeight: "600" },
  cellR: { color: "white", fontSize: 14, fontWeight: "700" },
  muted: { color: "#9CA3AF", fontSize: 13 },
  note: { color: "#6B7280", fontSize: 12, lineHeight: 18 },
  noteMini: { color: "#6B7280", fontSize: 11 },
  helpTap: { marginTop: 4 },
  helpTapText: { color: "#3B82F6", fontSize: 13, fontWeight: "600" },
  err: { color: "tomato" },
});
