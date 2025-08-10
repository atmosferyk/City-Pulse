import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import HapticPressable from "./HapticPressable";

type CardProps = {
  ComponentName: string;
  index: number;
  onPress?: () => void;
  children?: ReactNode;
};

export default function Card({
  ComponentName,
  onPress,
  index,
  children,
}: CardProps) {
  return (
    <HapticPressable
      onPress={onPress}
      haptic="light"
      triggerOn="pressIn"
      style={({ pressed }) => [
        styles.card,
        pressed && { backgroundColor: "#222" },
      ]}
      accessibilityRole="button"
      accessibilityLabel={ComponentName}
    >
      <Text style={styles.cardTitle}>{ComponentName}</Text>
      {children ? (
        children
      ) : (
        <Text style={styles.cardBody}>Placeholder content</Text>
      )}
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    flex: 1,
    minHeight: 120,
  },
  cardTitle: {
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 18,
  },
  cardBody: {
    color: "#aaa",
    fontSize: 14,
  },
});
