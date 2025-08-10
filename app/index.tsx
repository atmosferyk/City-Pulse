import Card from "@/components/Card";
import CurrencyStrip from "@/components/CurrencyStrip";
import { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STRIP_HEIGHT = 56; // keep footer height predictable for padding

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("");
  const [cityName, setCityName] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setCityName(trimmed);
      setInputValue("");
      Keyboard.dismiss();
    }
  }, [inputValue]);

  const bottomPad = useMemo(
    () => STRIP_HEIGHT + Math.max(insets.bottom, 8) + 8, // room for shadow + safe area
    [insets.bottom]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomPad },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Header
            cityName={cityName}
            updateTime="10:30"
            inputValue={inputValue}
            onInputValue={setInputValue}
            onSubmit={handleSubmit}
          />

          <Text style={styles.sectionTitle}>Today</Text>

          <View style={styles.cardsContainer}>
            <View style={styles.topRow}>
              <Card ComponentName="Pogoda" index={0} />
              <Card ComponentName="Jakość Powietrza" index={1} />
            </View>

            <Card ComponentName="Wiadomości" index={2} />
          </View>
        </ScrollView>

        {/* Fixed bottom currency strip (full width, safe-area aware) */}
        <View
          style={[
            styles.currencyStripContainer,
            {
              paddingBottom: Math.max(insets.bottom, 8),
              height: STRIP_HEIGHT + Math.max(insets.bottom, 8),
            },
          ]}
        >
          <CurrencyStrip
            rates={[
              { pair: "USD/PLN", value: 4.15 },
              { pair: "EUR/PLN", value: 4.49 },
              { pair: "GBP/PLN", value: 5.22 },
            ]}
            onPress={() => console.log("Go to /pln")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

type HeaderProps = {
  cityName: string | null;
  updateTime?: string;
  inputValue?: string;
  onInputValue: (name: string) => void;
  onSubmit: () => void;
};

function Header({
  cityName,
  updateTime,
  inputValue,
  onInputValue,
  onSubmit,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.rowCenter}>
        <Text style={styles.city}>{cityName || "Sprawdź jak jest u ciebie!"}</Text>
        <Text style={styles.meta}>Last update {updateTime}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Wpisz miasto i naciśnij Enter"
          placeholderTextColor="#6B7280"
          value={inputValue}
          onChangeText={onInputValue}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          textAlign="center"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          accessibilityLabel="Wyszukaj miasto"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  root: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 8, android: 8 }),
    gap: 16,
  },
  header: { alignItems: "center", gap: 16, marginBottom: 8, marginTop: 50 },
  rowCenter: { alignItems: "center", gap: 8 },
  city: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  meta: { color: "#aaa", fontSize: 13 },
  inputContainer: { alignItems: "center", width: "100%" },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    backgroundColor: "#1a1a1a",
    color: "white",
    width: "80%",
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    textAlign: 'center'
  },
  sectionTitle: {
    color: "#D1D5DB",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 2,
  },
  cardsContainer: { gap: 16 },
  topRow: { flexDirection: "row", gap: 16 },
  currencyStripContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#232329",
  },
});