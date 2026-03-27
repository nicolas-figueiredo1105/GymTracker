import { useRouter } from "expo-router";
import React from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
  


export default function CreateWorkout() {

  const auth = getAuth();

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutSet, setWorkoutSet] = useState(0);
  const [workoutRep, setWorkoutRep] = useState(0);

  const [exercises, setExercises] = useState<string[]>([]);
  const [sets, setSets] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);

  const router = useRouter();

  //User Data retrieval-----------------------------------
  const getUserData = async () => {
    const user = auth.currentUser;

    if(!user){
      console.log("No user logged in.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
      console.log("User data:" , userSnap.data());
      return userSnap.data();
    } else {
      console.log("No information found for this user");
      return null;
    }
  };

  //Workout retrieval-------------------------------------
  const getUserWorkouts = async () => {
    const user = auth.currentUser;

    if(!user){
      console.log("No user logged in.");
      return;
    }

    const workoutRef = doc(db, "workouts", user.uid);
    const workoutSnap = await getDoc(workoutRef);

    if(workoutSnap.exists()){
      return workoutSnap.data();
    } else {
      console.log("No workouts found for this user");
      return null;
    }
  };


  const createNewExercise = () => {
    setExercises(prev => [...prev, ""]);
  }

  const createNewSet = () => {
    setSets(prev => [...prev, ""]);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style = {styles.screen}>
      <View style={{width: 100, height: 50, marginBottom: 30,}}>
        <Pressable style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}
          onPress={() => router.push("/(tabs)/workout")}
          
        >
          <Ionicons name="chevron-back" size={30} color={"blue"}/>
          <Text style={{color: "blue", fontFamily:"Poppins_700Bold"}}>Cancel</Text>
      </Pressable>
      </View>
      
      <View style = {styles.content}>
        <View style={[styles.form]}>
          <TextInput
          placeholder="Workout Title"
          placeholderTextColor="#0004ff7a"
          style={[styles.input, {marginBottom: 30, minHeight: 60}]}
          />
          <ScrollView>
            <View>
              <TextInput
                style={[styles.input, {minHeight: 45,}]}
                placeholder="Exercise 1"
                placeholderTextColor="#0004ff7a"
              />

              <View style={{flexDirection: "row", alignItems: "center", justifyContent:"center", marginBottom: 20, gap: 10,}}>
                <Text style={[styles.text, {color: "blue"}]}>Set(s)</Text>
                <TextInput
                  style={[styles.input, {marginBottom: 0,}]}
                  keyboardType="number-pad"
                />

                <Text style={[styles.text, {width: 60, color: "blue"}]}>Initial Weight (lbs)</Text>
                <TextInput
                  style={[styles.input, {marginBottom: 0,}]}
                  keyboardType="number-pad"
                />
              </View>
            </View>


            {exercises.map((ex, index) => (
              <>
                <TextInput
                  key={index}
                  placeholder={`Exercise ${index + 2}`}
                  placeholderTextColor="#0004ff7a"
                  style={[styles.input, {minHeight: 45,}]}
                />

                <View style={{flexDirection: "row", alignItems: "center", justifyContent:"center", marginBottom: 20, gap: 10,}}>
                <Text style={[styles.text, {color: "blue"}]}>Set(s)</Text>
                <TextInput
                  style={[styles.input, {marginBottom: 0,}]}
                  keyboardType="number-pad"
                />

                <Text style={[styles.text, {width: 60, color: "blue"}]}>Initial Weight (lbs)</Text>
                <TextInput
                  style={[styles.input, {marginBottom: 0,}]}
                  keyboardType="number-pad"
                />
              </View>
              </>
            ))}
          </ScrollView>
        </View>
        
      
        <View style={{ flexDirection: "row", justifyContent:"center", alignItems: "center", width: "100%", gap: 10,}}>
          <Pressable style={styles.createButton}
           
          >
            <Text style={[styles.text, {color: "white"}]}>Create Workout</Text>
          </Pressable>

          <Pressable style={[styles.createButton, {backgroundColor: "white", borderColor: "blue", borderWidth: 3}]}
            onPress={createNewExercise}
          >
            <Text style={[styles.text, {color: "blue"}]}>Create Exercise</Text>
          </Pressable>
        </View>
      </View>
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
    shadowOffset: {width: 0, height: 1},
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

