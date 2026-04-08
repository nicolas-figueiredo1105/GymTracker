import { useRouter } from "expo-router";
import React from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase";



export default function CreateWorkout() {

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
    if(exercises.length <= 1 && workoutTitle.trim() === ""){
      return true;
    }
    return false;
  }


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS == "ios" ? "padding" : "height"}

        >
          <View style={{ width: 100, height: 50, marginBottom: 30, }}>
            <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={30} color={"blue"} />
              <Text style={{ color: "blue", fontFamily: "Poppins_700Bold" }}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            
              <TextInput
                placeholder="Workout Title"
                placeholderTextColor="#0004ff7a"
                style={[styles.input, { marginBottom: 30, minHeight: 60 }]}
                onChangeText={setWorkoutTitle}
              />

              <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >

              <View>
                <View>
                  <TextInput
                    style={[styles.input, { minHeight: 45, }]}
                    placeholder="Exercise 1"
                    placeholderTextColor="#0004ff7a"
                    onChangeText={(text) => {
                      setExercises(prev => {
                        const updated = [...prev];
                        updated[0] = text;
                        return updated;
                      });
                    }}
                  />

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20, gap: 10, }}>
                    <Text style={[styles.text, { color: "blue" }]}>Set(s)</Text>
                    <TextInput
                      style={[styles.input, { marginBottom: 0, }]}
                      keyboardType="number-pad"
                      onChangeText={(sets) => {
                        setSets(prev => {
                          const updated = [...prev];
                          updated[0] = sets;
                          return updated;
                        });
                      }}
                    />

                    <Text style={[styles.text, { width: 60, color: "blue" }]}>Initial Weight (lbs)</Text>
                    <TextInput
                      style={[styles.input, { marginBottom: 0, }]}
                      keyboardType="number-pad"
                      onChangeText={(weight) => {
                        setInitialWeight(prev => {
                          const updated = [...prev];
                          updated[0] = weight;
                          return updated;
                        });
                      }}
                    />
                  </View>
                </View>
              </View>

              {exercises.slice(1).map((ex, index) => (
                <React.Fragment key={index}>
                  <TextInput
                    key={index}
                    placeholder={`Exercise ${index + 2}`}
                    placeholderTextColor="#0004ff7a"
                    style={[styles.input, { minHeight: 45, }]}
                    onChangeText={(text) => {
                      setExercises(prev => {
                        const updated = [...prev];
                        updated[index + 1] = text;
                        return updated;
                      });
                    }}
                  />

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20, gap: 10, }}>
                    <Text style={[styles.text, { color: "blue" }]}>Set(s)</Text>
                    <TextInput
                      style={[styles.input, { marginBottom: 0, }]}
                      keyboardType="number-pad"
                      onChangeText={(sets) => {
                        setSets(prev => {
                          const updated = [...prev];
                          updated[index + 1] = sets;
                          return updated;
                        });
                      }}
                    />

                    <Text style={[styles.text, { width: 60, color: "blue" }]}>Initial Weight (lbs)</Text>
                    <TextInput
                      style={[styles.input, { marginBottom: 0, }]}
                      keyboardType="number-pad"
                      onChangeText={(weight) => {
                        setInitialWeight(prev => {
                          const updated = [...prev];
                          updated[index + 1] = weight;
                          return updated;
                        });
                      }}
                    />
                  </View>
                </React.Fragment>
              ))}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.createButton}
              onPress={() => saveWorkout()}
            >
              <Text style={[styles.text, { color: "white" }]}>Create Workout</Text>
            </Pressable>

            <Pressable style={[styles.createButton, { backgroundColor: "white", borderColor: "blue", borderWidth: 3 }]}
              onPress={createNewExercise}
            >
              <Text style={[styles.text, { color: "blue" }]}>Create Exercise</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  iconLogo: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    flexDirection: 'row',

    height: 100,
    alignItems: 'center',

    textAlign: 'left',

    marginBottom: 50,
    marginHorizontal: 20,

    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    //Android
    elevation: 5,

  },

  title: {
    color: "black",
    fontSize: 24,
    fontFamily: 'AlfaSlabOne_400Regular',

    marginRight: 40,
  },

  titleContent: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center'

  },

  content: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },

  form: {
    flex: 1,

  },

  scrollContent: {
    paddingBottom: 120,
  },

  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,

    textAlign: "center",
  },

  workoutCard: {
    backgroundColor: "blue",
    flex: 1,
    width: "100%",
    height: 150,


  },

  createButton: {
    backgroundColor: "blue",
    width: 120,
    height: 60,

    borderRadius: 10,


    justifyContent: 'center',

    marginTop: 20,
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

  input: {
    flex: 1,
    borderBottomWidth: 3,
    borderColor: "blue",

    backgroundColor: "#ecececbd",

    maxHeight: 50,

    padding: 10,

    marginBottom: 20,

    color: "blue",

    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },


});
