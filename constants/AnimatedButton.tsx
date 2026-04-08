import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useRouter } from "expo-router";

const router = useRouter();

type Exercise = {
  name?: string;
  sets?: number;
};

type Workout = {
  id: string;
  title?: string;
  exercises?: Exercise[];
};

type Props = {
  title: string;
  index: number;
  workout: Workout;
};

const AnimatedButton = ({ title, index, workout}: Props) => {
  const scale = useSharedValue(1);
  const isBright = index % 2 === 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.cardBase,
        isBright ? styles.workoutCardBright : styles.workoutCardDark,
        animatedStyle,
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={() => router.push({
          pathname: "/workout/startWorkout",
          params: { workoutId : workout.id}
        })}
        onPressIn={() => {
          scale.value = withSpring(0.92);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
      >
        <View>
          <Text style={isBright ? styles.titleBright : styles.titleDark}>
            {title}
          </Text>
          <View style={styles.exerciseList}>
            {workout.exercises?.map((exercise, exerciseIndex) => (
              <Text
                key={`${workout.id}-${exerciseIndex}`}
                style={isBright ? styles.textBright : styles.textDark}
              >
                {">"} {exercise.name} ({exercise.sets} sets)
              </Text>
            ))}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  cardBase: {
    width: "100%",
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
  },

  pressable: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },

  exerciseList: {
    paddingVertical: 10,
    maxHeight: 80,
    overflow: "hidden",
  },

  workoutCardBright: {
    backgroundColor: "white",
    borderColor: "blue",
    borderWidth: 5,
  },

  workoutCardDark: {
    backgroundColor: "blue",
  },

  titleDark: {
    color: "white",
    fontSize: 20,
    fontFamily: "AlfaSlabOne_400Regular",
  },

  titleBright: {
    color: "black",
    fontSize: 20,
    fontFamily: "AlfaSlabOne_400Regular",
  },

  textDark: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },

  textBright: {
    color: "black",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});
