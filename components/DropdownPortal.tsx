import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export type Anchor = { x: number; y: number; width: number; height: number };

type Props<T> = {
  visible: boolean;
  anchor: Anchor | null;
  data: T[];
  keyExtractor: (item: T, i: number) => string;
  renderLabel: (item: T) => { title: string; meta?: string };
  onSelect: (item: T) => void;
  onRequestClose: () => void;
  maxHeight?: number;
};

/**
 * Non-modal floating dropdown:
 * - Does NOT block the input (keeps focus)
 * - Backdrop only covers the area *below* the input, so typing is still possible
 */
export default function DropdownPortal<T>({
  visible,
  anchor,
  data,
  keyExtractor,
  renderLabel,
  onSelect,
  onRequestClose,
  maxHeight = 240,
}: Props<T>) {
  if (!visible || !anchor) return null;

  const top = anchor.y + anchor.height + 4; // small gap below input

  return (
    // Full-screen overlay that doesn't eat touches by default
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Backdrop: only below the input so the input remains interactive */}
      <Pressable
        onPress={onRequestClose}
        style={[styles.backdrop, { top }]}
        pointerEvents="auto"
        accessibilityLabel="Zamknij podpowiedzi"
      />

      {/* Panel positioned under the input */}
      <View
        style={[
          styles.panelContainer,
          { top, left: anchor.x, width: anchor.width },
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.panel, { maxHeight }]}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => {
              const { title, meta } = renderLabel(item);
              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && { backgroundColor: "#222" },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={title}
                >
                  <Text style={styles.title}>{title}</Text>
                  {meta ? <Text style={styles.meta}>{meta}</Text> : null}
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#262626" }} />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1000,
  },
  // Backdrop only below the input: lets the input stay focusable/editable
  backdrop: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    backgroundColor: "transparent",
  },
  panelContainer: {
    position: "absolute",
  },
  panel: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232329",
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  title: { color: "white", fontSize: 15, fontWeight: "600" },
  meta: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
});
