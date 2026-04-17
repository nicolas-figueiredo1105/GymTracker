import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";
import AnimatedPressable from "./AnimatedPressable";

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

const AnimatedWorkoutButton = ({ title, index, workout}: Props) => {
  const router = useRouter();
  const isBright = index % 2 === 0;

  return (
    <AnimatedPressable
      containerStyle={[
        styles.cardBase,
        isBright ? styles.workoutCardBright : styles.workoutCardDark,
      ]}
      style={styles.pressable}
      onPress={() => router.push({
          pathname: "../workoutScreens/startWorkout",
          params: { workoutId : workout.id}
        })}
      pressedScale={0.92}
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
    </AnimatedPressable>
  );
};

export default AnimatedWorkoutButton;

const styles = StyleSheet.create({
  cardBase: {
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
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

    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 7 },
    shadowOpacity: 0.4,
    shadowRadius: 4,

    //Android
    elevation: 5,
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
