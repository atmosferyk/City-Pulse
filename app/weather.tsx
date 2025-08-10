import { useCityStore } from "@/hooks/useCityStore";
import { useWeather } from "@/hooks/useWeather";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

function getWeatherEmoji(code: number) {
  // Based on WMO Weather interpretation codes
  if ([0].includes(code)) return "☀️"; // Clear
  if ([1, 2, 3].includes(code)) return "⛅"; // Mainly clear / Partly cloudy / Overcast
  if ([45, 48].includes(code)) return "🌫️"; // Fog
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️"; // Rain / showers
  if ([56, 57, 66, 67].includes(code)) return "🌦️"; // Freezing rain
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️"; // Snow
  if ([95, 96, 99].includes(code)) return "⛈️"; // Thunderstorm
  return "❔"; // Unknown
}

export default function WeatherScreen() {
  const { data, loading, error } = useWeather();
  const city = useCityStore((s) => s.city);

  return (
    <SafeAreaView style={st.safe}>
      <ScrollView contentContainerStyle={st.content}>
        <Text style={st.title}>{city?.name ?? "Pogoda"}</Text>

        {loading && <Text style={st.muted}>Ładowanie…</Text>}
        {error && <Text style={st.err}>Błąd: {error}</Text>}
        {!loading && !error && data && (
          <>
            <View style={st.currentBox}>
              <Text style={st.big}>
                {Math.round(data.current.temperature_2m)}°C
              </Text>
              <Text style={st.muted}>
                Odczuwalna {Math.round(data.current.apparent_temperature)}° •
                Wiatr {Math.round(data.current.wind_speed_10m)} km/h
              </Text>
              <Text style={st.mutedSmall}>Strefa: {data.timezone}</Text>
            </View>

            <Text style={st.subTitle}>Najbliższe dni</Text>
            <View style={{ gap: 8 }}>
              {data.daily.time.slice(0, 5).map((iso, i) => (
                <View key={iso} style={st.row}>
                  <Text style={st.day}>
                    {new Date(iso).toLocaleDateString("pl-PL", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </Text>
                  <Text style={st.emoji}>
                    {getWeatherEmoji(data.daily.weather_code[i])}
                  </Text>
                  <Text style={st.val}>
                    {Math.round(data.daily.temperature_2m_min[i])}° /{" "}
                    {Math.round(data.daily.temperature_2m_max[i])}°
                  </Text>
                </View>
              ))}
            </View>

            <Text style={st.subTitle}>Słońce</Text>
            <Text style={st.muted}>
              Wschód:{" "}
              {new Date(data.daily.sunrise[0]).toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • Zachód:{" "}
              {new Date(data.daily.sunset[0]).toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={st.subTitle}>Warunki</Text>
            <View style={st.grid}>
              <View style={st.tile}>
                <Text style={st.k}>Wilgotność</Text>
                <Text style={st.v}>
                  {Math.round(data.current.relative_humidity_2m)}%
                </Text>
              </View>

              <View style={st.tile}>
                <Text style={st.k}>Opad teraz</Text>
                <Text style={st.v}>
                  {data.current.precipitation.toFixed(1)} mm
                </Text>
              </View>

              <View style={st.tile}>
                <Text style={st.k}>Szansa dziś</Text>
                <Text style={st.v}>
                  {data.daily.precipitation_probability_max?.[0] ?? 0}%
                </Text>
              </View>

              <View style={st.tile}>
                <Text style={st.k}>Suma dziś</Text>
                <Text style={st.v}>
                  {(data.daily.precipitation_sum?.[0] ?? 0).toFixed(1)} mm
                </Text>
              </View>
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
  subTitle: { color: "#D1D5DB", fontSize: 16, fontWeight: "700", marginTop: 8 },
  currentBox: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    padding: 16,
    gap: 6,
  },
  big: { color: "white", fontSize: 40, fontWeight: "800" },
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
  day: { color: "#D1D5DB", fontSize: 14, fontWeight: "600" },
  val: { color: "white", fontSize: 14, fontWeight: "700" },
  muted: { color: "#9CA3AF", fontSize: 13 },
  mutedSmall: { color: "#6B7280", fontSize: 11 },
  err: { color: "tomato" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tile: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: "48%", // two per row
  },
  k: { color: "#9CA3AF", fontSize: 12, marginBottom: 4 },
  v: { color: "white", fontSize: 16, fontWeight: "700" },
  emoji: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  
});
