import { Stack, Link, useRouter, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Ionicons } from "@expo/vector-icons"
import { MaterialIcons } from "@expo/vector-icons";
import fontsLoaded from '../_layout'

import { auth, db } from "../../firebase";
import { getAuth, updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { serializableMappingCache } from "react-native-worklets";
import { getLabel } from "@react-navigation/elements";



export default function Settings() {

  const router = useRouter();

  const auth = getAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [isEditing, setIsEditing] = useState<any>(null);


  const [newValue, setNewValue] = useState("");
  const [newValueIn, setNewValueIn] = useState("");
  const [newValueFt, setNewValueFt] = useState("");


  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const getFirstName = async () => {
        const userData = await getUserData();
        if (userData != null) {
          return userData?.first_name;
        }
        return;
      }

      const loadData = async (field: any) => {
        const userData = await getUserData();


        if (!userData) return;

        return userData?.[field];
      }

      const loadUser = async () => {
        const user = auth.currentUser;

        const firstName = await getFirstName();
        const streak = await getStreak();
        const lastName = await loadData("last_name");
        const weight = await loadData("body_weight");
        const height = await loadData("height");
        const email = await user?.email;

        if (firstName) {
          setFirstName(firstName);
        }

        if (streak) {
          setStreak(streak);
        }

        if (lastName) {
          setLastName(lastName);
        }

        if (email) {
          setEmail(email);
        }

        if (weight) {
          setWeight(weight);
        }

        if (height) {
          setHeight(height);
        }
      };

      loadUser();
    }, [])
  )

  const getUserData = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user logged in.");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such user")
      return null;
    }
  };



  const getStreak = async () => {
    const userData = await getUserData();
    if (userData != null) {
      return userData?.streak;
    }
    return;
  }

  const updateData = async (field: any) => {
    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    if (field === "height") {
      const feet = parseInt(newValueFt);
      const inches = parseInt(newValueIn);
      
      if (feet >= 0 && (inches >= 0 && inches < 12)) {
        const formattedHeight = `${newValueFt}'${newValueIn}"`;

        await updateDoc(docRef, { height: formattedHeight });

        setHeight(formattedHeight);

        setIsEditing(null);

        setNewValue("");

        setNewValueFt("");
        setNewValueIn("");
      } else {
        alert("Field cannot be empty and inches can only be between 0 and 11 inclusive.")
      }


    } else if (newValue.length == 0) {
      alert("This field cannot be empty!");
    } else {
      await updateDoc(docRef, { [field]: newValue });

      if (field === "first_name") { setFirstName(newValue); }

      if (field === "last_name") setLastName(newValue);

      if (field === "body_weight") setWeight(newValue);

      setIsEditing(null);
      setNewValue("");
    }
  }

  const updateEmail = async (email: string) => {
    const user = auth.currentUser;

    if (!user) return;

    if (email.includes("@")) {
      updateEmail(email).then(() => {
        console.log("Email updated");
      }).catch((error) => {
        console.log(error);
      });

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, { email: [email] })
    } else {
      alert("Not a valid email: example@example.com")
      setNewValue("");
    }
  }

  const cancel = () => {
    setIsEditing(null);
    setNewValue("");
  }


  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.header,]}>

        <Pressable style={{ flexDirection: 'row', alignItems: 'center', }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={"blue"} />
          <Text style={{ color: "blue", fontFamily: "Poppins_700Bold" }}>Back</Text>
        </Pressable>

        <View style={[{ flexDirection: "row", alignItems: 'center' }]}>
          <Text style={styles.title}>Gym Tracker</Text>
          <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
        </View>

      </View>
      <View style={styles.content}>

        <Text style={[styles.title, { marginBottom: 20, fontSize: 28 }]}>View Profile</Text>

        <View style={styles.profileForm}>

          {/*First name---------------------------------------------------------------------------------*/}
          <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
            {isEditing !== "first_name" ? (

              <View style={{ maxHeight: 55, height: 55 }}>
                <Text style={[styles.text, { alignSelf: "flex-start" }]}>First Name:</Text>

                <View style={{ flex: 1, flexDirection: "row", gap: 10, alignItems: "center" }}>
                  <Text style={[styles.text, { borderColor: "blue", borderBottomWidth: 2, }]}>{firstName}</Text>
                  <Pressable
                    onPress={() => { setIsEditing("first_name"); }}
                  >
                    <Ionicons name={"pencil-outline"} size={20} color={"blue"} />
                  </Pressable>
                </View>

              </View>

            ) : (
              <View style={[{ gap: 10, alignItems: "center", maxHeight: 55, height: 55 }]}>
                <Text style={[styles.text, { alignSelf: "flex-start" }]}>First Name: </Text>

                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={styles.input}
                    value={newValue}
                    onChangeText={setNewValue}
                  />
                  <Pressable
                    onPress={() => updateData("first_name")}
                  >
                    <Ionicons name={"checkmark-circle"} size={24} color={"blue"} />
                  </Pressable>

                  <Pressable
                    onPress={() => cancel()}
                  >
                    <Ionicons name={"close-circle-outline"} size={24} color={"blue"} />
                  </Pressable>
                </View>
              </View>
            )}

            {/*Last name---------------------------------------------------------------------------------*/}
            <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
              {isEditing !== "last_name" ? (

                <View style={{ maxHeight: 55, height: 55 }}>
                  <Text style={[styles.text, { alignSelf: "flex-start" }]}>Last Name:</Text>

                  <View style={{ flex: 1, flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Text style={[styles.text, { borderColor: "blue", borderBottomWidth: 2, }]}>{lastName}</Text>
                    <Pressable
                      onPress={() => { setIsEditing("last_name"); }}
                    >
                      <Ionicons name={"pencil-outline"} size={20} color={"blue"} />
                    </Pressable>
                  </View>

                </View>

              ) : (
                <View style={[{ gap: 10, alignItems: "center", maxHeight: 55, height: 55 }]}>
                  <Text style={[styles.text, { alignSelf: "flex-start" }]}>Last Name: </Text>

                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={styles.input}
                      value={newValue}
                      onChangeText={setNewValue}
                    />
                    <Pressable
                      onPress={() => updateData("last_name")}
                    >
                      <Ionicons name={"checkmark-circle"} size={24} color={"blue"} />
                    </Pressable>

                    <Pressable
                      onPress={() => cancel()}
                    >
                      <Ionicons name={"close-circle-outline"} size={24} color={"blue"} />
                    </Pressable>
                  </View>
                </View>
              )}


            </View>
          </View>

          {/*Email---------------------------------------------------------------------------------*/}
          {isEditing !== "email" ? (
            <View style={[{ flexDirection: "row", gap: 10, }]}>
              <Text style={[styles.text,]}>Email:</Text>
              <Text style={[styles.text, { borderColor: "blue", borderBottomWidth: 2 }]}>{email}</Text>
              <Pressable
                onPress={() => { setIsEditing("email"); }}
              >
                <Ionicons name={"pencil-outline"} size={20} color={"blue"} />
              </Pressable>

            </View>

          ) : (
            <View style={[{ flexDirection: "row", gap: 10, alignItems: "center" }]}>
              <Text style={styles.text}>Email: </Text>
              <TextInput
                autoCapitalize="none"
                style={[styles.input, { minWidth: 180 }]}
                value={newValue}
                onChangeText={setNewValue}
              />
              <View style={{ flexDirection: 'row' }}>
                <Pressable
                  onPress={() => updateEmail(newValue)}
                >
                  <Ionicons name={"checkmark-circle"} size={24} color={"blue"} />
                </Pressable>

                <Pressable
                  onPress={() => cancel()}
                >
                  <Ionicons name={"close-circle-outline"} size={24} color={"blue"} />
                </Pressable>
              </View>
            </View>
          )}

          {/*Weight---------------------------------------------------------------------------------*/}
          <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
            {isEditing !== "body_weight" ? (

              <View style={{ maxHeight: 55, height: 55 }}>
                <Text style={[styles.text, { alignSelf: "flex-start" }]}>Body Weight:</Text>

                <View style={{ flex: 1, flexDirection: "row", gap: 10, alignItems: "center" }}>
                  <Text style={[styles.text, { borderColor: "blue", borderBottomWidth: 2, }]}>{weight} lbs</Text>
                  <Pressable
                    onPress={() => { setIsEditing("body_weight"); }}
                  >
                    <Ionicons name={"pencil-outline"} size={20} color={"blue"} />
                  </Pressable>
                </View>

              </View>

            ) : (
              <View style={[{ gap: 10, alignItems: "center", maxHeight: 55, height: 55 }]}>
                <Text style={[styles.text, { alignSelf: "flex-start" }]}>Body Weight: </Text>

                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={styles.input}
                    value={newValue}
                    onChangeText={setNewValue}
                  />
                  <Pressable
                    onPress={() => updateData("body_weight")}
                  >
                    <Ionicons name={"checkmark-circle"} size={24} color={"blue"} />
                  </Pressable>

                  <Pressable
                    onPress={() => cancel()}
                  >
                    <Ionicons name={"close-circle-outline"} size={24} color={"blue"} />
                  </Pressable>
                </View>
              </View>
            )}

            {/*Height---------------------------------------------------------------------------------*/}
            <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
              {isEditing !== "height" ? (

                <View style={{ maxHeight: 55, height: 55 }}>
                  <Text style={[styles.text, { alignSelf: "flex-start" }]}>Height:</Text>

                  <View style={{ flex: 1, flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Text style={[styles.text, { borderColor: "blue", borderBottomWidth: 2, }]}>{height}</Text>
                    <Pressable
                      onPress={() => { setIsEditing("height"); }}
                    >
                      <Ionicons name={"pencil-outline"} size={20} color={"blue"} />
                    </Pressable>
                  </View>

                </View>

              ) : (
                <View style={[{ gap: 10, alignItems: "center", maxHeight: 55, height: 55 }]}>
                  <Text style={[styles.text, { alignSelf: "flex-start" }]}>Height: </Text>

                  <View style={{ flexDirection: 'row', }}>


                    <TextInput
                      style={[styles.input, { minWidth: 30, textAlign: "center" }]}
                      value={newValueFt}
                      onChangeText={setNewValueFt}
                    />
                    <Text style={styles.text}>'</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input, { minWidth: 30, textAlign: "center" }]}
                      value={newValueIn}
                      onChangeText={setNewValueIn}
                    />
                    <Text style={styles.text}>"</Text>
                    <Pressable
                      onPress={() => updateData("height")}
                    >
                      <Ionicons name={"checkmark-circle"} size={24} color={"blue"} />
                    </Pressable>

                    <Pressable
                      onPress={() => cancel()}
                    >
                      <Ionicons name={"close-circle-outline"} size={24} color={"blue"} />
                    </Pressable>
                  </View>
                </View>
              )}


            </View>
          </View>


        </View>
      </View>
    </SafeAreaView>
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
    flex: 1,
    gap: 60,
    flexDirection: 'row',

    maxHeight: 100,
    alignItems: 'center',

    textAlign: 'left',

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

    marginRight: 10,
  },

  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,

    alignSelf: 'center',

    textAlign: 'left',

    color: "black",
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

  settingsWrap: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomWidth: 1,
    borderColor: "blue",

    maxHeight: 50,
  },

  settingsIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileForm: {
    flex: 1,
    gap: 20,

    paddingHorizontal: 40,
  },

  editWrap: {
    flexDirection: "row",

  },

  input: {
    borderBottomWidth: 2,
    borderColor: "blue",

    backgroundColor: "#ecececbd",

    maxHeight: 25,
    minWidth: 70,


    color: "blue",

    fontFamily: "Poppins_700Bold",
    marginBottom: 0,
    fontSize: 14,
  },
});

