import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";

import AnimatedWorkoutButton from "@/constants/AnimatedWorkoutButton";


export default function Workout() {

  const auth = getAuth();

  const [streak, setStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any>(null);

  const router = useRouter();


  useFocusEffect(
    useCallback(() => {
    const loadUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log("No user logged in.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User data:", userData);
        if (userData?.streak !== undefined) {
          setStreak(userData.streak);
        }
      } else {
        console.log("No information found for this user");
      }

      const workoutRef = collection(db, "users", user.uid, "workouts");
      const workoutSnap = await getDocs(workoutRef);

      const workoutsData = workoutSnap.empty
        ? []
        : workoutSnap.docs.map((workoutDoc) => ({
          id: workoutDoc.id,
          ...workoutDoc.data(),
        }));

      if (workoutSnap.empty) {
        console.log("No workouts found for this user");
      }

      setWorkouts(workoutsData);
    };

    loadUser();
  }, [])
);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
        <Text style={styles.title}>Gym Tracker</Text>
        <Ionicons name="flame" size={25} />
        <Text style={[styles.title, { marginRight: 15, }]}>{streak}</Text>
        <MaterialIcons name="account-circle" size={30} onPress={() => router.replace("/(tabs)/settings")} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { marginBottom: 25, }]}>My Workouts</Text>

        {workouts && workouts.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1, padding: 10,}}>
            {workouts.map((workout: any, index: number) => (
              <AnimatedWorkoutButton
                key={workout.id ?? index}
                title={workout.title}
                index={index}
                workout={workout}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.3, paddingBottom: 60 }]}>
            <FontAwesome5 name="dumbbell" size={60} style={[styles.iconLogo, { marginRight: 0 }]} />
            <Text style={[styles.title, { marginRight: 0 }]}>GymTracker</Text>
            <Text>No workouts yet</Text>
          </View>
        )}

        <Pressable style={styles.addButton}
          onPress={() => router.push("../workout/createWorkout")}
        >
          <Ionicons name="add" size={60} color={"white"} />
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

    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    //Android
    elevation: 5,

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

    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    //Android
    elevation: 5,

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

