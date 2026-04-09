import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform, SectionListComponent, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebase";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";



export default function StartWorkout() {

    const auth = getAuth();

    const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

    const [workout, setWorkout] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if(!startTime) return;

        const interval = setInterval(() => {
            const totalSeconds = Math.floor(( Date.now() - startTime) / 1000);

            const secondsPassed = totalSeconds % 60;
            const minutesPassed = Math.floor(totalSeconds / 60);

            setElapsedMinutes(minutesPassed);
            setElapsedSeconds(secondsPassed);

        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const startTimer = () => {
        if(!startTime){
            setStartTime(Date.now());
        }
        
    }

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

    const currentExercise = workout?.exercises?.[index];

    const setToInt = parseInt(currentExercise.sets);

    //Animation--------------------------------------------
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));


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

                    <View style={[styles.header, {justifyContent:"center", marginRight: 0}]}>
                        <Text style={[styles.title, {marginRight: 0}]}>
                            {loading ? "Loading..." : workout?.title ?? "Problem Loading Workout"}
                        </Text>
                        <Animated.View style={animatedStyle}>
                            <Pressable 
                                onPress={startTimer} 
                                onPressIn={() => scale.value = withSpring(0.90)} 
                                onPressOut={() => scale.value = withSpring(1)}
                                style={[styles.button, {paddingHorizontal: 10, borderRadius: 60}]}>
                                <Text style={[styles.text, {color: "white"}]}>Start Workout</Text>
                            </Pressable> 
                        </Animated.View>
                        <ScrollView style={[styles.scrollContent]}>
                        
                            {currentExercise && (
                                <>
                                <Text>{currentExercise.name}</Text>
                                {Array.from({ length: setToInt }).map((_, index) => (
                                    <TextInput
                                        
                                    />
                                ))}
                                </>
                            )}
                        </ScrollView>
                        
                        <View style={[styles.timer, {}]}>
                            <Text style={[styles.timerText]}>{String(elapsedMinutes).padStart(2, '0')}:{String(elapsedSeconds).padStart(2, '0')}</Text>
                        </View>
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
    },

    text: {
        fontFamily: "Poppins_700Bold",
        fontSize: 16,

        textAlign: "center",
    },

    timer: {
        justifyContent: "center",
        alignItems: "center",

        borderColor: "blue",
        borderWidth: 3,

        minWidth: 80,
        minHeight: 80,

        padding: 10,

        borderRadius: 80,

    },

    timerText: {
        fontFamily: 'AlfaSlabOne_400Regular',

    },

    button: {
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
