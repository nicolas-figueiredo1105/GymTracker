import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Button, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuth } from "firebase/auth";

import { Ionicons } from "@expo/vector-icons"
import { MaterialIcons } from "@expo/vector-icons";

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';


const personalInfo = () => {

  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();


  const auth = getAuth();
  const currentUser = auth.currentUser;

  const getCurrentUserInfo = () => {
    if (currentUser) {
      const uid = currentUser.uid;
      const email = currentUser.email;
      return { uid, email };
    } else {
      console.log("No user logged in");
      return undefined;
    }
  };

  const checkSubmit = () => {
    if (heightFt == '' || heightIn == '' || bodyWeight == '' || dateOfBirth == null) {
      alert("Empty Fields! Fill up all the required information");
      return false;
    } else {
      return true;
    }
  }

  const user = getCurrentUserInfo();

  const addPersonalInfo = async () => {
    try {
      if (!user) return;

      await setDoc(doc(db, "users", user.uid), {

        height: formatHeight(heightFt, heightIn),
        body_weight: bodyWeight,
        date_of_birth: dateOfBirth,
        email: currentUser?.email,

      },
        { merge: true }
      );
      console.log("User created: ", user.uid);
      router.push('/(tabs)/home');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDateDisplay = () => {
    setShowPicker(!showPicker);
  }

  const onChange = ( event: { type: string; } , selectedDate: any) => {
    if (event.type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDateDisplay();
        setDateOfBirth(formatDate(currentDate));
      }
    } else {
      toggleDateDisplay();
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(formatDate(date));
    toggleDateDisplay();
  }

  const formatDate = (rawDate: Date) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${month}/${day}/${year}`
  }

  const formatHeight = (heightF: string, heightI: string) => {
    return `${heightF}'${heightI}"`;
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowPicker(false);
    }}>
      <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={styles.header}>
            <Text style={styles.title}>Gym Tracker</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.formTitle}>Sign Up</Text>

            <View style={[styles.form]}>
              <View style={[styles.rowWrap, {alignItems: 'center'}]}>
                <Text>Ft:</Text>
                <TextInput
                  style={[styles.input, { flex: 1, maxWidth: "15%" }]}
                  value={heightFt}
                  onChangeText={setHeightFt}
                  placeholderTextColor={"#000000a9"}
                  keyboardType='number-pad'
                />

                <Text>In:</Text>
                <TextInput
                  style={[styles.input, { flex: 1, maxWidth: "15%" }]}
                  value={heightIn}
                  onChangeText={setHeightIn}
                  placeholderTextColor={"#000000a9"}
                  keyboardType='number-pad'
                />

                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={bodyWeight}
                  onChangeText={setBodyWeight}
                  placeholder="Body Weight"
                  placeholderTextColor={"#000000a9"}
                  keyboardType='number-pad'
                />
              </View>

              <View style={[styles.rowWrap, { justifyContent: 'flex-start' }]}>
                <Text style={[styles.text, { marginBottom: 0, }]}>Date of Birth: </Text>

                {showPicker && (
                  
                  <View style= {styles.dateTimeContainer}>
                    <DateTimePicker
                      mode='date'
                      display='spinner'
                      value={date}
                      onChange={onChange}
                      style={[styles.datePicker, { position: 'relative' }]}
                      maximumDate={new Date()}
                    />
                    {Platform.OS === "ios" && (
                      <View
                        style={{ flexDirection: 'row', gap: 20 }}
                      >
                        <TouchableOpacity style={[styles.cancelButton, {}]} onPress={confirmIOSDate}>
                          <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cancelButton, {backgroundColor: "white", borderColor: 'blue', borderWidth: 2}]} onPress={toggleDateDisplay}>
                          <Text style={[styles.buttonText, {color: 'blue'}]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {!showPicker && (
                  <Pressable
                    onPress={toggleDateDisplay}
                    style={{ flex: 1, }}
                  >
                    <TextInput
                      style={[styles.dateInput, { letterSpacing: 1, }]}
                      value={dateOfBirth}
                      caretHidden={true}
                      placeholder='MM/DD/YYYY'
                      onChangeText={setDateOfBirth}
                      onPress={() => setShowPicker(true)}
                      editable={false}
                      onPressIn={toggleDateDisplay}
                    />
                  </Pressable>
                )}



              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.signupButton,
                  {
                    backgroundColor: pressed ? "white" : "blue",
                    color: pressed ? "blue" : "white",
                    marginTop: 200, 
                  }
                ]}
                onPress={() => {
                  if(checkSubmit()){
                    addPersonalInfo();

                    setHeightFt('');
                    setHeightIn('');
                    setBodyWeight('')
                    setDateOfBirth('')
                  }
                }}
              >
                {({ pressed }) => (
                  <Text style={[styles.buttonText,
                  { color: pressed ? "blue" : "white", }
                  ]}>Get Started!</Text>
                )}
              </Pressable>

            </View>


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

  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',

    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,

    paddingTop:60,

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
    
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,

    marginBottom: 30,
    paddingTop: 50,

    backgroundColor: "white",

    height: "100%"
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

    height: '100%',

    alignSelf: 'center',
    justifyContent: "center",
    alignContent: 'center',
    alignItems: 'center',
  },

  dateInput: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,

    padding: 10,

    borderWidth: 2,
    borderRadius: 10,

    height: '100%',
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

  dateTimeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 100,
  },

  datePicker: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: "100%",
  },

  cancelButton: {
    backgroundColor: 'blue',
    padding: 10,
    width: 100,
    borderRadius: 10,
  },



});

export default personalInfo