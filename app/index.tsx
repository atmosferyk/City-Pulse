import Card from "@/components/Card";
import CurrencyStrip from "@/components/CurrencyStrip";
import DropdownPortal, { Anchor } from "@/components/DropdownPortal";
import WeatherCard from "@/components/WeatherCard";
import { useCitySearch } from "@/hooks/useCitySearch";
import { City, useCityStore } from "@/hooks/useCityStore";
import { useFx } from "@/hooks/useFx";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { View as RNView } from "react-native";
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

const STRIP_HEIGHT = 56;

export default function HomeScreen() {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const { results, loading } = useCitySearch(inputValue);

  const insets = useSafeAreaInsets();
  const city = useCityStore((s) => s.city);
  const setCity = useCityStore((s) => s.setCity);

  const [showDropdown, setShowDropdown] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const inputWrapperRef = useRef<View>(null);

  const measureAnchor = useCallback(() => {
    inputWrapperRef.current?.measureInWindow?.(
      (x: number, y: number, w: number, h: number) => {
        setAnchor({ x, y, width: w, height: h });
      }
    );
  }, []);

  const handlePick = useCallback(
    (c: City) => {
      setCity(c);
      setInputValue("");
      setShowDropdown(false);
      Keyboard.dismiss();
    },
    [setCity]
  );

  const {
    data: fx,
    loading: fxLoading,
    error: fxError,
    asOf: fxAsOf,
    refresh: refreshFx,
  } = useFx();

  const bottomPad = useMemo(
    () => STRIP_HEIGHT + Math.max(insets.bottom, 8) + 8,
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
          onScrollBeginDrag={() => setShowDropdown(false)}
        >
          <Header
            cityTitle={city?.name ?? "Sprawdź co u ciebie"}
            updateTime="10:30"
            inputValue={inputValue}
            onInputValue={(t) => {
              setInputValue(t);
              if (t.trim().length >= 2) {
                measureAnchor();
                setShowDropdown(true);
              } else {
                setShowDropdown(false);
              }
            }}
            onFocusInput={() => {
              if (inputValue.trim().length >= 2) {
                measureAnchor();
                setShowDropdown(true);
              }
            }}
            measureAnchor={measureAnchor}
            inputWrapperRef={inputWrapperRef}
          />

          <Text style={styles.sectionTitle}>Dzisiaj</Text>

          <View style={styles.cardsContainer}>
            <View style={styles.topRow}>
              <Card
                ComponentName="Pogoda"
                index={0}
                onPress={() => router.push("/weather")}
              >
                <WeatherCard />
              </Card>

              <Card ComponentName="Jakość Powietrza" index={1} />
            </View>
            <Card ComponentName="Wiadomości" index={2} />
          </View>
        </ScrollView>

        <DropdownPortal
          visible={
            showDropdown &&
            inputValue.trim().length >= 2 &&
            !loading &&
            results.length > 0
          }
          anchor={anchor}
          data={results}
          keyExtractor={(item, i) => item.name + item.latitude + i}
          renderLabel={(item) => ({
            title: item.label,
            meta: `(${item.countryCode})`,
          })}
          onSelect={(item) => {
            handlePick(item);
          }}
          onRequestClose={() => setShowDropdown(false)}
        />

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
            rates={(fx ?? []).map((r) => ({ pair: r.pair, value: r.value }))}
            onPress={() => console.log("Go to /pln")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

type HeaderProps = {
  cityTitle: string;
  updateTime?: string;
  inputValue: string;
  onInputValue: (name: string) => void;
  onFocusInput: () => void;
  measureAnchor: () => void;
  inputWrapperRef: React.MutableRefObject<RNView | null>;
};

function Header({
  cityTitle,
  updateTime,
  inputValue,
  onInputValue,
  onFocusInput,
  measureAnchor,
  inputWrapperRef,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.rowCenter}>
        <Text style={styles.city}>
          {cityTitle || "Sprawdź jak jest u ciebie!"}
        </Text>
        <Text style={styles.meta}>Ostatnia aktualizacja: {updateTime}</Text>
      </View>

      <View style={styles.inputContainer}>
        <View
          ref={inputWrapperRef}
          style={styles.inputWrapper}
          onLayout={measureAnchor}
        >
          <TextInput
            style={styles.input}
            placeholder="Wpisz miasto…"
            placeholderTextColor="#6B7280"
            value={inputValue}
            onChangeText={onInputValue}
            onFocus={() => {
              onFocusInput();
              measureAnchor();
            }}
            returnKeyType="search"
            textAlign="center"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            accessibilityLabel="Wyszukaj miasto"
            onSubmitEditing={() => {}}
          />
        </View>
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
  header: {
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
    marginTop: 50,
    position: "relative",
  },
  rowCenter: { alignItems: "center", gap: 8 },
  city: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  meta: { color: "#aaa", fontSize: 13 },
  inputContainer: {
    alignItems: "center",
    width: "100%",
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    position: "relative",
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#1a1a1a",
    color: "white",
    width: "100%",
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    textAlign: "center",
    outlineStyle: "none" as any, // web polish
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
