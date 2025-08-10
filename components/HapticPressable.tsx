import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { GestureResponderEvent, Platform, Pressable, PressableProps } from "react-native";

type HapticKind =
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | false;

type Props = PressableProps & {
  haptic?: HapticKind;              // default: "selection"
  triggerOn?: "press" | "pressIn";  // default: "pressIn"
  disableHaptics?: boolean;
};

const fire = async (kind: HapticKind) => {
  if (!kind) return;
  try {
    switch (kind) {
      case "selection": return Haptics.selectionAsync();
      case "light":     return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case "medium":    return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case "heavy":     return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case "success":   return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case "warning":   return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case "error":     return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch (error) {
    // no-op if device/OS disables haptics or if there's an error
    console.warn('Haptics not available:', error);
  }
};

export default function HapticPressable({
  haptic = "selection",
  triggerOn = "pressIn",
  disableHaptics,
  onPressIn,
  onPress,
  ...rest
}: Props) {
  const handlePressIn = useCallback(
    async (e: GestureResponderEvent) => {
      try {
        if (!disableHaptics && triggerOn === "pressIn") await fire(haptic);
      } catch (error) {
        console.warn('Error in haptic press in:', error);
      }
      onPressIn?.(e);
    },
    [disableHaptics, triggerOn, haptic, onPressIn]
  );

  const handlePress = useCallback(
    async (e: GestureResponderEvent) => {
      try {
        if (!disableHaptics && triggerOn === "press") await fire(haptic);
      } catch (error) {
        console.warn('Error in haptic press:', error);
      }
      onPress?.(e);
    },
    [disableHaptics, triggerOn, haptic, onPress]
  );

  // Optional: skip very old Androids if you want
  const disabledByPlatform =
    Platform.OS === "android" && Platform.Version && Number(Platform.Version) < 26;

  return (
    <Pressable
      onPressIn={disabledByPlatform ? onPressIn : handlePressIn}
      onPress={disabledByPlatform ? onPress : handlePress}
      {...rest}
    />
  );
}
