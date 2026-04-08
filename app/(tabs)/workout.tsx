import { useRouter } from "expo-router";
import React ,{ useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";



export default function Workout() {

  const auth = getAuth();

  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any>(null);

  const router = useRouter();

  //Setters------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const firstNameVal = await getFirstName();
      const streakVal = await getStreak();
      const workoutsData = await getUserWorkouts();

      if (firstNameVal) {
        setFirstName(firstNameVal);
      }

      if (streakVal !== undefined) {
        setStreak(streakVal);
      }

      if (workoutsData) {
        setWorkouts(workoutsData);
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

//Animation---------------------------------------
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return{
      transform: [{ scale: scale.value}],
    };
  });

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
        <Text style = {[styles.title, {marginBottom: 25,}]}>My Workouts</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
        {workouts && workouts.length > 0 ? (
          workouts.map((workout: any, index : number) => (
            <Animated.View
              style={animatedStyle}
            >
              <Pressable key={workout.id} style={index % 2 === 0 ? styles.workoutCardBright : styles.workoutCardDark} 
                onPressIn={() => { 
                  scale.value = withSpring(0.90)
                }}  
                onPressOut={() => {
                  scale.value = withSpring(1.00)
                }}
              >
                
                <View>
                  <Text style={index % 2 === 0 ? styles.titleBright : styles.titleDark}>{workout.title}</Text>
                  <View style={{paddingVertical: 10, maxHeight: 80, overflow:"hidden"}}>
                  {workout.exercises && workout.exercises.map((ex: any, i : number) => (
                    <Text key={i} style={index % 2 === 0 ? styles.textBright : styles.textDark}>&gt; {ex.name} ({ex.sets} sets)</Text>
                  ))}
                  </View>
                </View>
                
              </Pressable>
           </Animated.View>
          ))
        ) : (
          <Text>No workouts yet</Text>
        )}
        </ScrollView>
        <Pressable style={styles.addButton}
          onPress={() => router.push("/workout/createWorkout")}
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

