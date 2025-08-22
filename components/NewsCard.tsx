import { useNews } from "@/hooks/useNews";
import { StyleSheet, Text, View } from "react-native";

export default function NewsCardContent() {
  const { data, loading, error } = useNews();

  if (loading) return <Text style={s.muted}>Ładowanie…</Text>;
  if (error)   return <Text style={s.muted}>Błąd: {error}</Text>;
  if (!data || data.length === 0) return <Text style={s.muted}>Brak wiadomości</Text>;

  const top = data.slice(0, 3);

  return (
    <View style={{ gap: 8 }}>
      {top.map((n) => (
        <Text key={n.id} numberOfLines={2} style={s.item}>
          • {n.title}
        </Text>
      ))}
      <Text style={s.more}>Zobacz więcej →</Text>
    </View>
  );
}

const s = StyleSheet.create({
  item: { color: "white", fontSize: 14, lineHeight: 20 },
  more: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  muted: { color: "#9CA3AF", fontSize: 14 },
});
