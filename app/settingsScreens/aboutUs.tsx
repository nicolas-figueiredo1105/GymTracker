import { useRouter } from "expo-router";
import React from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase";



export default function AboutUs() {

  const auth = getAuth();

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [sets, setSets] = useState<string[]>([]);
  const [initialWeight, setInitialWeight] = useState<string[]>([]);

  const router = useRouter();


  const createNewExercise = () => {
    setExercises(prev => [...prev, ""]);
  }

  const saveWorkout = async () => {
    if (!isEmpty()) {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const ref = collection(db, "users", user.uid, "workouts");

        const workout = {
          title: workoutTitle,
          exercises: exercises.map((exercise, index) => ({
            name: exercise,
            sets: sets[index] || "",
            initialWeight: initialWeight[index] || "",
          })),
          createdAt: new Date(),
        };

        await addDoc(ref, workout);

        console.log("Workout created.");
        router.back();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Empty workout title and/or only one exercise logged. Insert title and add more than one exercise.")
    }
  };

  const isEmpty = () => {
    if (exercises.length <= 1 && workoutTitle.trim() === "") {
      return true;
    }
    return false;
  }


  return (


    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{flex: 1,}}
        behavior={Platform.OS == "ios" ? "padding" : "height"}

      >
        <View style={{ width: 100, height: 50, marginBottom: 15, }}>
          <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={30} color={"blue"} />
            <Text style={{ color: "blue", fontFamily: "Poppins_700Bold" }}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.content}>

          <View style={[{ flexDirection:"row" ,alignItems: "center", justifyContent: "center", marginBottom: 40, gap: 15}]}>
            <FontAwesome5 name="dumbbell" size={55} style={[styles.iconLogo, { marginRight: 0 }]} />
            <Text style={[styles.title, { marginRight: 0 }]}>GymTracker</Text>
            
          </View>

          <Text style={[styles.text, {textAlign: "justify", fontSize: 14,}]}>
            Our mission is to make fitness tracking simple, accessible, and motivating for everyone. We believe that 
            understanding your body and progress shouldn’t be complicated, so we focus on turning your workout information into clear, meaningful insights 
            you can actually use.  Our goal is to help you stay consistent, 
            build healthier habits, and feel more in control of your fitness journey. Whether you're just getting started or pushing toward new goals, 
            we’re here to support you every step of the way.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>GymTracker &copy; 2026</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconLogo: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },

  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  title: {
    color: "black",
    fontSize: 36,
    fontFamily: 'AlfaSlabOne_400Regular',

    textAlign: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 30,

    alignItems: "center",
    justifyContent: "center"

    
  },

  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,

    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 10,
    paddingBottom: 8,
    backgroundColor: "white",
  },

});
