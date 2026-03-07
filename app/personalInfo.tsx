import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Button } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuth } from "firebase/auth";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const personalInfo = () => {

  const [height, setHeight] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');

  const [show, setShow] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());


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
        <SafeAreaView style={styles.screen}>

          <View style={styles.header}>
            <Text style={styles.title}>Gym Tracker</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.formTitle}>Sign Up</Text>

            <View style={styles.form}>
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

              <Button
                title="Date of Birth"
                onPress={() => setShow(true)}
              />
              {show && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display='default'
                  onChange={(event, selectedDate) => {
                    setShow(false);
                    if (selectedDate) {
                      setDateOfBirth(selectedDate);
                    }
                  }}
                />
              )}

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
                addPersonalInfo();
                setHeight('');
                setBodyWeight('');
                setDateOfBirth(new Date());
              }}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText,
                { color: pressed ? "blue" : "white" }
                ]}>Get Started!</Text>
              )}
            </Pressable>
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

export default personalInfo