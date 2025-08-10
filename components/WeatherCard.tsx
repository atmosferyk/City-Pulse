import { useWeather } from "@/hooks/useWeather";
import { StyleSheet, Text, View } from "react-native";

function wmoToEmoji(code: number) {
  // very rough mapping
  if ([0].includes(code)) return "☀️";
  if ([1,2,3].includes(code)) return "⛅";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75,85,86].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
}

export default function WeatherCardContent() {
  const { data, loading, error, city } = useWeather();

  if (!city) return <Text style={s.muted}>Wybierz miasto</Text>;
  if (loading) return <Text style={s.muted}>Ładowanie…</Text>;
  if (error)   return <Text style={s.muted}>Błąd: {error}</Text>;
  if (!data)   return <Text style={s.muted}>Brak danych</Text>;

  const c = data.current;
  const todayMax = data.daily.temperature_2m_max?.[0];
  const todayMin = data.daily.temperature_2m_min?.[0];

  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <Text style={s.emoji}>{wmoToEmoji(c.weather_code)}</Text>
        <Text style={s.temp}>{Math.round(c.temperature_2m)}°</Text>
      </View>
      <Text style={s.meta}>
        Odczuwalna {Math.round(c.apparent_temperature)}°  •  Wiatr {Math.round(c.wind_speed_10m)} km/h
      </Text>
      <Text style={s.range}>
        Dziś: {Math.round(todayMin)}° / {Math.round(todayMax)}°
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  emoji: { fontSize: 28 },
  temp: { color: "white", fontSize: 32, fontWeight: "800" },
  meta: { color: "#9CA3AF", fontSize: 12 },
  range: { color: "#D1D5DB", fontSize: 13, fontWeight: "600" },
  muted: { color: "#9CA3AF", fontSize: 14 },
});
