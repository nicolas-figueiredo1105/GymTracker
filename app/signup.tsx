import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { DatabaseService } from "../database/databaseMethods";
import db from "../database/database";
import { useRouter } from "expo-router";



const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const router = useRouter();

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
                            placeholder="Email"
                            placeholderTextColor={"#000000a9"}
                            keyboardType='email-address'
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.input, {width: "100%"}]}
                            placeholder="Password"
                            placeholderTextColor={"#000000a9"}
                            secureTextEntry
                            textContentType='password'
                        />
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
                            DatabaseService.createUser(firstName, lastName, email, password);
                            const user = db.getAllSync("SELECT * FROM users");
                            console.log(user);
                            router.push("/(tabs)/home");
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