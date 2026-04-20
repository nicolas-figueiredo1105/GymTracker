import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

import { Dropdown } from 'react-native-element-dropdown';
import { LineChart, Pointer } from "react-native-gifted-charts";

import { StatusBar } from "expo-status-bar";
import AnimatedWorkoutButton from "@/constants/AnimatedWorkoutButton";



export default function Home() {

  const auth = getAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState(0);
  const [initWeight, setInitWeight] = useState("");

  const [workouts, setWorkouts] = useState<any>(null);

  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const [selectedExercise, setSelectExercise] = useState<any>(null);
  const [exercises, setExercises] = useState<any>([]);

  const [workoutTitles, setWorkoutTitles] = useState<any>([]);

  const [exerciseWeightHistory, setExerciseWeightHistory] = useState<any>([]);

  const [bmi, setBmi] = useState(0);

  //Load name, streak and BMI
  useFocusEffect(
    useCallback(() => {
      const loadName = async () => {
        const getFName = await getFirstName();
        setFirstName(getFName);
      };

      const heightToInt = async () => {
        const userData = await getUserData();
        const height = userData?.height;

        return (parseInt(height.substring(2, 4))) + (parseInt(height.substring(0, 1)) * 12);
      };

      const calculateBmi = async () => {
        const userData = await getUserData();

        const bodyWeight = parseInt(userData?.body_weight);
        console.log("Body weight: " + bodyWeight);
        const height = await heightToInt();
        console.log("Height(In): " + height);

        const bmiFormula = (bodyWeight * 703) / Math.pow(height, 2);

        setBmi(Number(bmiFormula.toFixed(1)));
        console.log(bmi);
      };

      loadName();
      loadStreak();
      calculateBmi();

      setSelectedWorkout(null);
      setSelectExercise(null);
      setWorkoutTitles([]);
    }, [])
  );

  //Load initial weight for selected exercise
useEffect(() => {
  const loadInitWeight = async () => {
    if (!selectedWorkout || !selectedExercise) return;

    const workoutData = selectedWorkout;

    const exercise = workoutData.exercises.find(
      (ex: any) => ex.name === selectedExercise
    );

    setInitWeight(exercise?.initialWeight ?? "");
  };

  loadInitWeight();
}, [selectedWorkout, selectedExercise]);

  //Load workouts
  useEffect(() => {
    const loadWorkouts = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log("No user logged in");
        return;
      }

      const workoutRef = collection(db, "users", user.uid, "workouts");
      const workoutSnap = await getDocs(workoutRef);

      const workoutHistoryRef = collection(db, "users", user.uid, "workoutHistory");
      const workoutHistorySnap = await getDocs(workoutHistoryRef);

      if (workoutSnap.empty) return;

      const workoutsData = workoutSnap.empty ? [] : workoutSnap.docs.map((workoutDoc: any) => ({
        id: workoutDoc.id,
        ...workoutDoc.data(),
      }));

      setWorkouts(workoutsData);
    }
    loadWorkouts();
  }, []);

  //Load workout titles
  useFocusEffect(
    useCallback(() => {
      if (!workouts) return;

      const titles = workouts.map((workout: any,) => ({
        label: workout.title,
        value: workout.id,
      }));

      setWorkoutTitles(titles);
    }, [workouts])
  )

  //Load selected workout exercises titles
  useEffect(() => {
    if (!selectedWorkout) return;

    const exTitles = selectedWorkout.exercises.map((ex: any) => ({
      label: ex.name,
      value: ex.name,
    }));


    setExercises(exTitles);
  }, [selectedWorkout]);



  //Load selected exercise history
  useEffect(() => {
    const user = auth.currentUser;

    const getExerciseData = async () => {
      if (!user) return;

      const snap = await getDocs(collection(db, "users", user.uid, "workoutHistory"));

      const allHistory = snap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));

      if (!selectedExercise) {
        setExerciseWeightHistory([]);
        return;
      }

      const getExerciseHistory = allHistory.map(session => {
        return session.exercise_info.filter((ex: any) => ex.name === selectedExercise).flatMap((ex: any) => ex.sets.map((set: any) =>
        ({
          value: parseInt(set.weight),
          label: session.date.toDate().toLocaleString(),
          date: session.date.toMillis(),
        }))
        );
      });



      const average = getExerciseHistory.filter(group => group.length > 0).map(group => {
        const avg = group.reduce((sum: number, item: any) => sum + item.value, 0) / group.length;

        return {
          value: Math.round(avg * 10) / 10,
          label: new Date(group[0]?.date).toLocaleDateString("en-DT", { month: "2-digit", day: "numeric", year: "2-digit" }),
          date: group[0]?.date,
        }
      })


      average.sort((a: any, b: any) => a.date - b.date);

      setExerciseWeightHistory(average);
    }

    getExerciseData();
    console.log(exerciseWeightHistory);

  }, [selectedWorkout, selectedExercise]);

  const getUserData = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user logged in.");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such user")
      return null;
    }
  };

  const getFirstName = async () => {
    const userData = await getUserData();
    if (userData != null) {
      return userData?.first_name;
    }
    return;
  }

  const loadStreak = async () => {
    const userData = await getUserData();

    if (!userData) return;

    const dbStreak = userData?.streak;
    setStreak(dbStreak);
  }


  const getBmiStyle = () => {
    if (bmi < 18.5) {
      return [{ backgroundColor: "lightblue" }]; //Underweight
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return [{ backgroundColor: "lightgreen" }]; //Healthy Weight
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return [{ backgroundColor: "#ffa600", }]; //Overweight
    } else if (bmi >= 30) {
      return [{ backgroundColor: "#ff0000" }]; //Obese
    }
  }

  const getMessage = () => {
    if (bmi < 18.5) {
      return "You are under the underweight range. Consider focusing on nutrient-dense foods and strength-building habits. If needed, consult a healthcare professional for personalized guidance"; //Underweight
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "You are within a healthy weight range. Keep maintaining balanced nutrition and regular physical activity."; //Healthy Weight
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return "You are in the overweight range. Small lifestyle changes like improving diet and increasing physical activity can help improve your health over time."; //Overweight
    } else if (bmi >= 30) {
      return "You are in the obese range. Consider adopting gradual, sustainable lifestyle changes and speaking with a healthcare professional for support tailored to you."; //Obese
    }
  }






  return (




    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1, padding: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
          <Text style={[styles.title]}>Gym Tracker</Text>
          <Ionicons name="flame" size={25} />
          <Text style={[styles.title, { marginRight: 15, }]}>{streak}</Text>
          <MaterialIcons name="account-circle" size={30} onPress={() => router.replace("/(tabs)/settings")} />
        </View>
        <View style={styles.content}>
          <View>
            <Text style={[styles.title, { marginBottom: 20, fontSize: 28, }]}>Hello {firstName},</Text>
          </View>

          <View style={{ flex: 1, }}>

            <View>
              <Text style={[styles.title2, { marginBottom: 20 }]}>Lifting Progress</Text>
              {workoutTitles.length > 0 ? (
                <>
                  <Text style={[styles.text, { marginBottom: 30, }]}>Check how much you progressed based on the average weight lifted in each of your workouts.</Text>
                  <View style={[{ flexDirection: "row", flex: 1, marginBottom: 40, justifyContent: "space-around" }]}>
                    <Dropdown
                      style={styles.dropdown}
                      placeholder="Select Workout"
                      placeholderStyle={{ fontFamily: "Poppins_700Bold" }}
                      selectedTextStyle={{ fontFamily: "Poppins_700Bold" }}
                      onChange={(item) => {
                        const workout = workouts.find((w: any) => w.id === item.value);
                        setSelectedWorkout(workout);

                        setSelectExercise(null);
                        setExerciseWeightHistory([]);
                      }}
                      data={workoutTitles}
                      labelField={"label"}
                      valueField={"value"}
                    />

                    {selectedWorkout && (
                      <Dropdown
                        style={[styles.dropdown,]}
                        placeholderStyle={{ fontFamily: "Poppins_700Bold" }}
                        selectedTextStyle={{ fontFamily: "Poppins_700Bold" }}
                        onChange={(item) => setSelectExercise(item.value)}
                        placeholder="Select Exercise"
                        data={exercises}
                        labelField={"label"}
                        valueField={"value"}
                        value={selectedExercise}
                      />

                    )}
                  </View>


                  {selectedExercise && (

                    <View style={{ marginBottom: 40 }}>
                      {exerciseWeightHistory.length > 0 ? (
                        <View>
                          <Text style={[styles.text, { fontSize: 20 }]}>{selectedExercise}</Text>
                          <Text style={[styles.text, {marginBottom: 20}]}>Initial weight:  <Text style={{color: "blue"}}>{initWeight} lbs</Text></Text>
                          <LineChart
                            data={exerciseWeightHistory}
                            focusEnabled
                            focusedDataPointColor={"blue"}
                            showDataPointOnFocus
                            focusedDataPointLabelComponent={(info: any) => {
                              return (
                                <View style={{
                                  backgroundColor: "blue",
                                  padding: 8,
                                  borderRadius: 4,
                                  zIndex: 100,
                                }}>
                                  <Text style={{ color: "white", fontFamily: "Poppins_700Bold" }}>Weight: {info.value}lbs</Text>
                                  <Text style={{ color: "white", fontFamily: "Poppins_700Bold" }}>Date: {info.label}</Text>
                                </View>
                              )
                            }}
                            dataPointLabelWidth={150}
                            dataPointLabelShiftY={40}
                            dataPointLabelShiftX={20}

                            spacing={100}
                            xAxisLabelTextStyle={[styles.textGraph, { width: 100, }]}
                            yAxisTextStyle={styles.textGraph}


                            initialSpacing={60}
                            endSpacing={60}

                            delayBeforeUnFocus={1000}

                          />
                        </View>
                      ) : (
                        <Text style={[styles.text, { textAlign: "center" }]}>
                          No workout history for this exercise.
                        </Text>
                      )}
                    </View>
                  )}
                </>
              ) : (
                <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.3, paddingBottom: 60 }]}>
                  <FontAwesome5 name="dumbbell" size={60} style={[styles.iconLogo, { marginRight: 0 }]} />
                  <Text style={[styles.title, { marginRight: 0 }]}>GymTracker</Text>
                  <Text>No workouts yet</Text>
                </View>
              )}



              <View style={[styles.quickStartWrap, { marginBottom: 40 }]}>
                <Text style={styles.title2}>Quick Start</Text>

                {workouts && workouts.length > 0 ? (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={{ flexDirection: "row", gap: 40 }}>
                      {workouts.map((workout: any, index: number) => (
                        <AnimatedWorkoutButton
                          key={workout.id ?? index}
                          title={workout.title}
                          index={index}
                          workout={workout}
                        />
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.3, paddingBottom: 60 }]}>
                    <FontAwesome5 name="dumbbell" size={60} style={[styles.iconLogo, { marginRight: 0 }]} />
                    <Text style={[styles.title, { marginRight: 0 }]}>GymTracker</Text>
                    <Text>No workouts yet</Text>
                  </View>
                )}

              </View>

              <Text style={[styles.title2, { marginBottom: 10, }]}>My BMI</Text>
              <View style={[styles.bmiCard, getBmiStyle(), { marginBottom: 30, }]}>
                <Text style={[styles.bmiTitle, { textAlign: "center" }]}>BMI Value: {bmi}</Text>
                <Text style={[styles.text, { marginBottom: 20, }]}>{getMessage()}</Text>
              </View>

            </View>

          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 60
  },

  header: {
    flexDirection: 'row',


    height: 100,
    alignItems: 'center',

    textAlign: 'left',

    marginBottom: 40,
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

  title2: {
    color: "black",
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',

    marginRight: 40,
    marginBottom: 20,
  },

  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,

    textAlign: "justify",

    color: "black",
  },

  textGraph: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,

    color: "black",
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

  dropdown: {
    minHeight: 50,
    width: 120,
    borderBottomWidth: 2,
    borderColor: "blue",

    fontFamily: "Poppins_700Bold",
  },

  quickStartWrap: {

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

  bmiCard: {
    flex: 1,

    borderRadius: 40,
    padding: 30,

    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    //Android
    elevation: 5,
  },

  bmiTitle: {
    color: "black",
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',

    marginBottom: 20,
  },
});

