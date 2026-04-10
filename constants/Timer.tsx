import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type Props = {
    minutes: number,
    seconds: number
}

const Timer = React.memo(({ minutes, seconds } : Props) => {
    return (
        <View style={[styles.timer, {}]}>
            <Text style={[styles.timerText]}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
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

        marginTop: 20,
    },

    timerText: {
        fontFamily: 'AlfaSlabOne_400Regular',
        textAlign: "center",
    },
})

export default Timer