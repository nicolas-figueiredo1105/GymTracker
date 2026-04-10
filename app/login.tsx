import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack } from 'expo-router';
import { useRouter } from "expo-router";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from '../firebase';




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in!");
      router.push('/(tabs)/home');
      return userCredential.user;
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials, Try Again.")
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          gestureEnabled: false,
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text style={styles.title}>Gym Tracker</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.formTitle}>Log In</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={"#000000a9"}
              keyboardType='email-address'
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"#000000a9"}
              secureTextEntry
              textContentType='password'
            />

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: pressed ? "white" : "blue",
                  color: pressed ? "blue" : "white"
                }
              ]}
              onPress={() => {
                login();

                setEmail('');
                setPassword('');
              }}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText,
                { color: pressed ? "blue" : "white" }
                ]}>Log In</Text>
              )}



            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.text}>Don't have an account?{"\n"}Sign up right now!</Text>
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: pressed ? "white" : "blue",
                  color: pressed ? "blue" : "white"
                }
              ]}
              onPress={() => router.push("/signup")}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText,
                { color: pressed ? "blue" : "white" }
                ]}>Sign Up</Text>
              )}
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
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

    marginBottom: 20,

    borderRadius: 10,
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
});

export default Login