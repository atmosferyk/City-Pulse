import { useAir } from "@/hooks/useAir";
import { StyleSheet, Text, View } from "react-native";

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

export default function AirCardContent() {
  const { data, loading, error } = useAir();

  if (loading) return <Text style={s.muted}>Ładowanie…</Text>;
  if (error) return <Text style={s.muted}>Błąd: {error}</Text>;
  if (!data) return <Text style={s.muted}>Brak danych</Text>;

  return (
    <View style={{ gap: 6 }}>
      <View style={s.row} accessible accessibilityLabel={`AQI ${data.aqi}, ${data.category}`}>
        <Text style={s.big}>AQI {data.aqi}</Text>
        <View style={[s.chip, { backgroundColor: tagColor(data.category) }]}>
          <Text style={s.chipText}>{data.category}</Text>
        </View>
      </View>

      <Text style={s.meta}>
        PM2.5: {data.pm25 ?? "—"} µg/m³   •   PM10: {data.pm10 ?? "—"} µg/m³
      </Text>
      <Text style={s.metaSmall}>
        NO₂: {data.no2 ?? "—"} µg/m³   •   O₃: {data.o3 ?? "—"} µg/m³
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  big: { color: "white", fontSize: 28, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: { borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  chipText: { color: "white", fontSize: 12, fontWeight: "700" },
  meta: { color: "#D1D5DB", fontSize: 13, fontWeight: "600" },
  metaSmall: { color: "#9CA3AF", fontSize: 11 },
  muted: { color: "#9CA3AF", fontSize: 14 },
});
