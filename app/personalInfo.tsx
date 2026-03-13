import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuth } from "firebase/auth";

import {Ionicons} from "@expo/vector-icons"
import {MaterialIcons} from "@expo/vector-icons";

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const personalInfo = () => {

  const [height, setHeight] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');


  const router = useRouter();


  const auth = getAuth();
  const currentUser = auth.currentUser;

  const getCurrentUserInfo = () => {
    if(currentUser){
      const uid = currentUser.uid;
      const email = currentUser.email;
      return {uid, email};
    } else {
      console.log("No user logged in");
      return undefined;
    }
  };

  const checkSubmit = () => {
    if(height == '' || bodyWeight == '' || dateOfBirth == null){
      alert("Empty Fields! Fill up all the required information");
    }
  }

  const user = getCurrentUserInfo();
    
  const addPersonalInfo = async () => {
    try {
      if(!user) return;

      await setDoc(doc(db, "users", user.uid), {

        height: height,
        body_weight: bodyWeight,
        date_of_birth: dateOfBirth,
        email: currentUser?.email,

      }, 
      {merge: true}
    );
      console.log("User created: ", user.uid);
      router.push('/(tabs)/home');
    } catch(error){
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>

          <View style={styles.header}>
            <Text style={styles.title}>Gym Tracker</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.formTitle}>Sign Up</Text>

            <View style={[styles.form]}>
              <View style={styles.rowWrap}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Height"
                  placeholderTextColor={"#000000a9"}
                  keyboardType='numeric'
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={bodyWeight}
                  onChangeText={setBodyWeight}
                  placeholder="Body Weight"
                  placeholderTextColor={"#000000a9"}
                  keyboardType='numbers-and-punctuation'
                />
              </View>
              
              <View style={[styles.rowWrap, {justifyContent:'space-between'}]}>
                <Text style= {[styles.text, {marginBottom: 0,}]}>Date of Birth: </Text>
                <TextInput
                  style = {[styles.input, {position: 'relative', width: "60%"}]}
                  autoCapitalize='none'
                  autoCorrect={false}
                  caretHidden = {true}
                  keyboardType='number-pad'
                  maxLength={8}
                  onChangeText={setDateOfBirth}
                >
                  <View style= {styles.inputOverflow}>
                    {'MM/DD/YYYY'.split('').map((placeholder, index, arr) => {
                      const countDelimiters = arr.slice(0, index).filter(char => char === '/').length;
                      const indexWithoutDelimeters = index - countDelimiters;
                      const current = dateOfBirth[indexWithoutDelimeters]

                      return (
                        <Text key={index} style = {styles.inputChar}>
                          {placeholder}
                        </Text>
                      )
                    })}
                  </View>
                </TextInput>
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
                checkSubmit();
                addPersonalInfo();
                setHeight('');
                setBodyWeight('');
                setDateOfBirth('');
              }}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText,
                { color: pressed ? "blue" : "white" }
                ]}>Get Started!</Text>
              )}
            </Pressable>

            </View>

            
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    profileIcon: {
        position: 'absolute',
        right: 20,
        top: 100,
    },

    header: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',

        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,

        marginBottom: 50,

        //iOS
        
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 6,

        //Android
        elevation: 5,

    },

    title: {
        color: "white",
        fontSize: 30,
        fontFamily: 'AlfaSlabOne_400Regular',

        position: 'absolute',
    },

    content: {
        paddingLeft: 30,
        paddingRight: 30,

        marginBottom: 30,

        flex: 1,
        backgroundColor: "white",
        
    },

    formTitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 20,
        alignSelf: 'center',

        marginBottom: 20,
    },

    input: {
        position: 'relative',
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        padding: 10,
        borderWidth: 2,

        borderRadius: 10,
        width: "50%",
        height: '100%',

        alignSelf: 'center',
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center',

        zIndex: 2,
    },

    inputOverflow: {
      width: "50%",
      backgroundColor: 'white',
      borderRadius: 10,
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',

      zIndex: 1,
    },

    inputChar: {
      flex: 1,
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
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

        height: 50,
    },

    form: {
        flex: 1,
        gap: 10,
        marginBottom: 50,
    },


});

export default personalInfo