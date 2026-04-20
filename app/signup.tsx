import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Ionicons } from '@expo/vector-icons';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streak, setStreak] = useState(0);

    const router = useRouter();

    const [canSee, setCanSee] = useState(false);

    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                first_name: firstName,
                last_name: lastName,
                email: email,
                streak: streak,
            });

            console.log("User created: ", user.uid);
            router.push('/personalInfo');
        } catch (error) {
            console.log(error)
            alert("Empty fields! Please fill up all the required information.")
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.screen}>

                <View style={styles.header}>
                    <Text style={styles.title}>Gym Tracker</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.formTitle}>Sign Up</Text>
                    
                    <View style = {styles.form}>
                        <View style={styles.rowWrap}>
                            <TextInput
                                style={[styles.input, {flex: 1}]}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                placeholderTextColor={"#000000a9"}
                            />
                            <TextInput
                                style={[styles.input, {flex: 1}]}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                placeholderTextColor={"#000000a9"}
                            />
                        </View>

                        <TextInput
                            style={[styles.input, {width: "100%"}]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                            placeholder="Email"
                            placeholderTextColor={"#000000a9"}
                            keyboardType='email-address'
                        />
                        <View style={{position: "relative"}}>
                          <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.input, {width: "100%", minHeight: 47}]}
                            placeholder="Password"
                            placeholderTextColor={"#000000a9"}
                            secureTextEntry={(!canSee)}
                            textContentType="password"
                        />
                        <Pressable
                                onPress={() => setCanSee(!canSee)}
                                style={{position: "absolute", bottom: 8, right: 20}}
                            >
                                <Ionicons name={(!canSee) ? "eye-off-outline" : "eye-outline"} color={"blue"} size={30}/>
                            </Pressable>  
                        </View>
                        
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.signupButton,
                            {
                                backgroundColor: pressed ? "white" : "blue",
                                color: pressed ? "blue" : "white"
                            }
                        ]}
                        onPress={() => {                    
                            signUp();
                            
                            setFirstName('');
                            setLastName('');
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        {({ pressed }) => (
                            <Text style={[styles.buttonText,
                            { color: pressed ? "blue" : "white" }
                            ]}>Create Account</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </TouchableWithoutFeedback>
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

export default SignUp