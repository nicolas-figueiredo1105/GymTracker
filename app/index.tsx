import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter, Redirect } from "expo-router";
import { createUserWithEmailAndPassword, validatePassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, getAuth, db } from "../firebase";
import { Ionicons } from '@expo/vector-icons';



const Index = () => {
    

    const router = useRouter();

    const [canSee, setCanSee] = useState(false);

    const checkUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser();
        
        if(!user) return <Redirect href="login.txt"/>;
    };

    return (
        
                               
    )
}


const styles = StyleSheet.create({
    profileIcon: {
        position: 'absolute',
        right: 20,
        top: 100,
    },

    screen: {
        flex: 1,
        backgroundColor: "white",
    },

    header: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',

        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,

        marginBottom: 50,

        //iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,

        //Android
        elevation: 5,

    },

    title: {
        color: "white",
        fontSize: 30,
        fontFamily: 'AlfaSlabOne_400Regular',

        position: 'absolute',
        top: 100,
    },

    content: {
        top: '10%',
        paddingLeft: 30,
        paddingRight: 30,

        marginBottom: 30,
    },

    formTitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 20,
        alignSelf: 'center',

        marginBottom: 20,
    },

    input: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        padding: 10,
        borderWidth: 2,

        borderRadius: 10,

        alignSelf: 'center',
        justifyContent: "center",
    },

    loginButton: {
        backgroundColor: "blue",

        borderColor: "blue",
        borderWidth: 4,

        justifyContent: 'center',
        alignItems: 'center',

        alignSelf: 'center',

        borderRadius: 20,
        width: "40%",
        height: "18%"
    },


    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        textAlign: 'center',
    },

    signupButton: {
        backgroundColor: "blue",

        borderColor: "blue",
        borderWidth: 2,

        justifyContent: 'center',
        alignItems: 'center',


        alignSelf: 'center',

        borderRadius: 20,
        width: "40%",
        height: "18%"
    },

    text: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,

        alignSelf: 'center',

        textAlign: 'center',

        marginBottom: 20,
    },

    rowWrap: {
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    form: {
        gap: 10,
        marginBottom: 50,
    },
});

export default Index