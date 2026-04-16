import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, setDoc, addDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

import FocusHideInput from "@/constants/FocusHideInput";
import AnimatedPressable from "@/constants/AnimatedPressable";

import { Stack } from "expo-router";
import Timer from "@/constants/Timer";


export default function StartWorkout() {

    const auth = getAuth();

    const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

    const [workout, setWorkout] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [sessionData, setSessionData] = useState<any[]>([]);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [totalSavedMs, setTotalSavedMs] = useState(0);
    const [totalMs, setTotalMs] = useState(0);

    useEffect(() => {
        if (startTime === null || !isRunning) return;

        const interval = setInterval(() => {
            setTotalMs(totalSavedMs + (Date.now() - startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isRunning, totalSavedMs]);

    const startTimer = () => {
        if (isRunning) return;
        setStartTime(Date.now());
        setIsRunning(true);
    }

    const stopTimer = () => {
        if (!isRunning || startTime === null) return;
        const total = totalSavedMs + (Date.now() - startTime);
        setTotalSavedMs(total);
        setTotalMs(total);
        setIsRunning(false);
        setStartTime(null);
    }

    const totalSeconds = Math.floor(totalMs / 1000);
    const elapsedSeconds = totalSeconds % 60;
    const elapsedMinutes = Math.floor(totalSeconds / 60);

    const router = useRouter();

    useEffect(() => {
        const getWorkout = async () => {
            const user = auth.currentUser;

            if (!user || !workoutId) {
                setLoading(false);
                return;
            }

            const workoutRef = doc(db, "users", user!.uid, "workouts", workoutId);
            const workoutSnap = await getDoc(workoutRef);

            if (workoutSnap.exists()) {
                setWorkout({
                    id: workoutSnap.id,
                    ...workoutSnap.data()
                })
            }
            setLoading(false);

        }
        getWorkout();
    }, [workoutId]);

    const choiceAlert = () => {
        Alert.alert(
            "Confirm Action",
            "Are you sure you want to go back? Your workout won't be saved.", [
            {
                text: "Yes",
                onPress: () => router.back(),
                style: "destructive",
            },
            {
                text: 'Cancel',
                style: "cancel",
            }
        ]
        )
    }

    useEffect(() => {
        if (!workout?.exercises) return;

        const initialSessionData = workout.exercises.map((exercise: any) => ({
            name: exercise.name,
            sets: Array.from({ length: parseInt(exercise.sets) || 0 }, () => ({
                weight: "",
                reps: "",
            })),
        }));

        setSessionData(initialSessionData);
    }, [workout]);

    const updateSetValue = (
        exerciseIndex: number,
        setIndex: number,
        field: "weight" | "reps",
        value: string
    ) => {
        setSessionData((prev: any) => {
            return prev.map((exercise: any, exIdx: number) => {
                if (exIdx !== exerciseIndex) return exercise;

                return {
                    ...exercise,
                    sets: exercise.sets.map((set: any, sIdx: number) => {
                        if (sIdx !== setIndex) return set;

                        return {
                            ...set,
                            [field]: value,
                        };
                    }),
                };
            });
        });
    };

    const saveWorkout = async () => {
        const user = auth.currentUser;
        try {
            if (!user) return;

            const ref = collection(db, "users", user.uid, "workoutHistory");

            const workoutHistory = {
                title: workout.title,
                date: new Date(),
                exercise_info: sessionData,
                duration: totalMs / 1000,
            }

            await addDoc(collection(db, "users", user.uid, "workoutHistory"), workoutHistory);

            router.back();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    gestureEnabled: false,
                }}
            />



            <SafeAreaView style={styles.screen}>
                <KeyboardAvoidingView
                    style={styles.content}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}

                >
                    <View style={{ width: 100, height: 50, }}>
                        <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}
                            onPress={() => choiceAlert()}
                        >
                            <Ionicons name="chevron-back" size={30} color={"blue"} />
                            <Text style={{ color: "blue", fontFamily: "Poppins_700Bold" }}>Back</Text>
                        </Pressable>
                    </View>
                    <ScrollView
                        style={[styles.scrollContent, { flex: 1, }]}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        <View style={[styles.header, { justifyContent: "center", marginRight: 0, marginTop: 35, }]}>
                            <Text style={[styles.title, { marginRight: 0, fontSize: 36 }]}>
                                {loading ? "Loading..." : workout?.title ?? "Problem Loading Workout"}
                            </Text>
                            <AnimatedPressable
                                onPress={startTimer}
                                style={[styles.button, { paddingHorizontal: 10, borderRadius: 60, backgroundColor: "#05bd0e" }]}>
                                <Text style={[styles.text, { color: "white" }]}>Start Timer</Text>
                            </AnimatedPressable>


                        </View>
                        <View style={{ flex: 1, width: "100%", }}>

                            {workout?.exercises?.map((ex: any, exerciseIndex: number) => (
                                <View key={ex.id ?? `exercise-${exerciseIndex}`} style={{ marginBottom: 30, }}>
                                    <Text style={[styles.text, { textAlign: "left", color: "blue", fontSize: 25, marginBottom: 15 }]}>
                                        {ex?.name}
                                    </Text>
                                    <View style={[{ gap: 20 }]}>
                                        {Array.from({ length: parseInt(ex?.sets) || 0 }).map((_, setIndex) => (
                                            <View key={`exercise-${exerciseIndex}-set-${setIndex}`} style={[{ flex: 1, gap: 10 }]}>
                                                <Text style={[styles.text, { color: "blue", textAlign: "left", borderColor: "blue", borderBottomWidth: 3, }]}>Set {setIndex + 1}</Text>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <FocusHideInput
                                                        defaultPlaceholder="Weight"
                                                        placeholderTextColor={"#2600ff93"}
                                                        value={sessionData?.[exerciseIndex]?.sets?.[setIndex]?.weight ?? ""}
                                                        onChangeText={(text) => updateSetValue(exerciseIndex, setIndex, "weight", text)}
                                                        style={[styles.input, { maxWidth: 100, marginBottom: 0, fontSize: 16, marginRight: 10, }]}
                                                        keyboardType="decimal-pad"
                                                    />
                                                    <Text style={[styles.text, { color: "blue", marginRight: 35, }]}>
                                                        (Lbs)
                                                    </Text>

                                                    <FocusHideInput
                                                        defaultPlaceholder="Reps"
                                                        placeholderTextColor={"#2600ff93"}
                                                        value={sessionData?.[exerciseIndex]?.sets?.[setIndex]?.reps ?? ""}
                                                        onChangeText={(text) => updateSetValue(exerciseIndex, setIndex, "reps", text)}
                                                        style={[styles.input, { maxWidth: 80, marginBottom: 0, fontSize: 16 }]}
                                                        keyboardType="decimal-pad"
                                                    />
                                                </View>

                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Timer
                    minutes={elapsedMinutes}
                    seconds={elapsedSeconds}
                />

                <View style={styles.footer}>
                    <AnimatedPressable
                        onPress={saveWorkout}
                        style={[styles.button, { paddingHorizontal: 10, borderRadius: 60 }]}>
                        <Text style={[styles.text, { color: "white" }]}>Finish Workout</Text>
                    </AnimatedPressable>

                    <AnimatedPressable
                        onPress={() => {
                            stopTimer();
                        }}
                        style={[styles.buttonAlt, { paddingHorizontal: 10, borderRadius: 60 }]}>
                        <Text style={[styles.text, { color: "blue" }]}>Stop Timer</Text>
                    </AnimatedPressable>
                </View>


            </SafeAreaView>

        </>
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
        height: 100,
        alignItems: 'center',

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
        flex: 1,

    },

    text: {
        fontFamily: "Poppins_700Bold",
        fontSize: 16,

        textAlign: "center",
    },

    timer: {
        flex: 1,

        justifyContent: "center",
        alignSelf: "center",

        borderColor: "blue",
        borderWidth: 3,

        width: 100,
        maxHeight: 100,

        padding: 10,

        borderRadius: 80,

    },

    timerText: {
        fontFamily: 'AlfaSlabOne_400Regular',
        textAlign: "center",
    },

    button: {
        backgroundColor: "blue",
        width: 120,
        height: 60,

        borderRadius: 10,


        justifyContent: 'center',

        marginTop: 20,
    },

    buttonAlt: {
        backgroundColor: "white",
        width: 120,
        height: 60,

        borderColor: "blue",
        borderWidth: 3,
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
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "blue",

        backgroundColor: "#ecececbd",

        maxHeight: 50,

        padding: 10,


        color: "blue",

        fontFamily: "Poppins_700Bold",

        width: 100,
        marginBottom: 0,
        fontSize: 16,

        textAlign: "center",
    },


});
