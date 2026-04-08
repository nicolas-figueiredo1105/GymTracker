import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated'
import React, { useRef, useState } from 'react'

import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
    title: string;
    sets: string;
    onPress: () => void;
}

const [workouts, setWorkouts] = useState<any>(null);
const auth = getAuth();

  //Workout retrieval-------------------------------------
  const getUserWorkouts = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user logged in.");
      return;
    }

    const workoutRef = collection(db, "users", user.uid, "workouts");
    const workoutSnap = await getDocs(workoutRef);

    if (!workoutSnap.empty) {
      return workoutSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.log("No workouts found for this user");
      return [];
    }
  };


const AnimatedButton = ({ title, sets, onPress }: Props) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View>
            <Pressable
                onPressIn={() => {
                    scale.value = withSpring(0.98);
                }}

                onPressOut={() => {
                    scale.value = withSpring(1.0);
                }}
            >
                <Text>{title}</Text>
            </Pressable>
        </Animated.View>
    )
}

export default AnimatedButton;

const styles = StyleSheet.create({
    workoutCardBright: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    height: 150,

    paddingVertical: 20,
    paddingHorizontal: 30,

    marginBottom: 30,

    borderColor: "blue",
    borderWidth: 5,
    borderRadius: 20,

    overflow: "hidden",

  },

  workoutCardDark: {
    backgroundColor: "blue",

    flex: 1,
    width: "100%",
    height: 150,

    paddingVertical: 20,
    paddingHorizontal: 30,

    marginBottom: 30,

    borderRadius: 20,

    overflow: "hidden",
  },

  titleDark: {
    color: "white",
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',

  },

  titleBright: {
    color: "black",
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',
  },

  textDark : {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },

  textBright: {
    color: "black",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
})