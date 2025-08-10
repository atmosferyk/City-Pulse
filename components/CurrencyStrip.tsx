import { ScrollView, StyleSheet, Text, View } from "react-native";
import HapticPressable from "./HapticPressable";

type CurrencyStripProps = {
  rates: { pair: string; value: number }[];
  onPress?: () => void;
};

export default function CurrencyStrip({ rates, onPress }: CurrencyStripProps) {
  return (
    <HapticPressable
      onPress={onPress}
      haptic="selection"
      triggerOn="press" // avoids buzzing while user is horizontally scrolling
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityLabel="Zobacz szczegóły kursów walut"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.inner}
      >
        {rates.map((rate, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.pair}>{rate.pair}</Text>
            <Text style={styles.value}>{rate.value.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    paddingHorizontal: 16,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
  },
  pair: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
