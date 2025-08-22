import { useNews } from "@/hooks/useNews";
import { Linking, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function NewsScreen() {
  const { data, loading, error, refresh, city } = useNews();

  return (
    <SafeAreaView style={st.safe}>
      <ScrollView
        contentContainerStyle={st.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={st.title}>{city?.name ? `Wiadomości — ${city.name}` : "Wiadomości"}</Text>

        {error && <Text style={st.err}>Błąd: {error}</Text>}
        {!loading && (!data || data.length === 0) && (
          <Text style={st.muted}>Brak wiadomości dla tego miasta.</Text>
        )}

        <View style={{ gap: 12 }}>
          {(data ?? []).map((n) => (
            <Pressable
              key={n.id}
              onPress={() => Linking.openURL(n.url)}
              style={({ pressed }) => [st.row, pressed && { backgroundColor: "#151515" }]}
              accessibilityRole="button"
              accessibilityLabel={`Otwórz: ${n.title}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={st.headline}>{n.title}</Text>
                <Text style={st.meta}>
                  {n.source} {n.publishedAt ? `• ${new Date(n.publishedAt).toLocaleString("pl-PL", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}` : ""}
                </Text>
              </View>
              <Text style={st.chev}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { padding: 16, gap: 16 },
  title: { color: "white", fontSize: 24, fontWeight: "800", textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  headline: { color: "white", fontSize: 16, fontWeight: "700" },
  meta: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  chev: { color: "#9CA3AF", fontSize: 24, paddingLeft: 8 },
  muted: { color: "#9CA3AF", fontSize: 14 },
  err: { color: "tomato" },
});
