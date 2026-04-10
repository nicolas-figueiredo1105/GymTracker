import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = PressableProps & {
  containerStyle?: StyleProp<ViewStyle>;
  pressedScale?: number;
};

export default function AnimatedPressable({
  children,
  containerStyle,
  pressedScale = 0.94,
  onPressIn,
  onPressOut,
  style,
  ...pressableProps
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <Pressable
        {...pressableProps}
        style={style}
        onPressIn={(event) => {
          scale.value = withSpring(pressedScale);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1);
          onPressOut?.(event);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
