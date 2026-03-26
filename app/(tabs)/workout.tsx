import { Link } from "expo-router";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Keyboard, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {Ionicons} from "@expo/vector-icons"
import {MaterialIcons} from "@expo/vector-icons";
import fontsLoaded from '../_layout'

import { auth, db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
  


export default function Workout() {

  const auth = getAuth();

  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState(0);

  const router = useRouter();

  //Setters------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const firstName = await getFirstName();
      const streak = await getStreak();

      if(firstName) {
        setFirstName(firstName);
      }

      if(streak) {
        setStreak(streak);
      }

    };
    loadUser();
  }, []);

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

  //Getters---------------------------------------------
  const getFirstName = async () => {
    const userData = await getUserData();
    if(userData != null){
      return userData?.first_name;
    }
    return;
  }

  const getStreak = async () => {
    const userData = await getUserData();
    if(userData != null){
      return userData?.streak;
    }
    return;
  }

  const getWorkoutTitle = async () => {
    const workoutData = await getUserWorkouts();

    if(workoutData != null){
      return workoutData?.title;
    }
    return;
  }


  return (
    <SafeAreaView style = {styles.screen}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
        <Text style = {styles.title}>Gym Tracker</Text>
        <Ionicons name="flame" size={25}/>
        <Text style = {[styles.title, {marginRight: 15,}]}>{streak}</Text>
        <MaterialIcons name="account-circle" size={30}/>
      </View>
      <View style = {styles.content}>
        <Text style = {styles.title}>My Workouts</Text>
        <Pressable style={styles.addButton}
          onPress={() => router.push("/createWorkout")}
        >
          <Ionicons name="add" size={60} color={"white"}/>
        </Pressable>
      </View>
    </SafeAreaView>
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

  dashBoard: {
    
  },

  dashBoardText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },

  workoutCard: {
    backgroundColor: "blue",
    flex: 1,
    width: "100%",
    height: 150,
  },

  addButton: {
    backgroundColor: "blue",
    width: 60,
    height: 60,

    borderRadius: 60,

    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

    position: 'absolute',

    right: 30,
    bottom: 0,
  },
});

