import { Stack, Link, useRouter, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Ionicons } from "@expo/vector-icons"
import { MaterialIcons } from "@expo/vector-icons";
import fontsLoaded from '../_layout'

import { auth, db } from "../../firebase";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";



export default function Settings() {

  const router = useRouter();

  const auth = getAuth();

  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const firstName = await getFirstName();
        const streak = await getStreak();

        if (firstName) {
          setFirstName(firstName);
        }

        if (streak) {
          setStreak(streak);
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

  const getFirstName = async () => {
    const userData = await getUserData();
    if (userData != null) {
      return userData?.first_name;
    }
    return;
  }

  const getStreak = async () => {
    const userData = await getUserData();
    if (userData != null) {
      return userData?.streak;
    }
    return;
  }

  const signout = () => {
    signOut(auth).then(() => {
      console.log("User signed out successfully.");
      router.push("/login");
    }).catch((error) => {
      console.log(error);
    });
  }


  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
        <Text style={styles.title}>Gym Tracker</Text>
        <Ionicons name="flame" size={25} />
        <Text style={[styles.title, { marginRight: 15, }]}>{streak}</Text>
        <MaterialIcons name="account-circle" size={30} />
      </View>
      <View style={styles.content}>

        <Text style={[styles.title, { marginBottom: 20, fontSize: 28 }]}>Settings</Text>
        <View style={styles.settingsContent}>


          <Pressable
            style={[styles.settingsWrap, {}]}
            onPress={() => router.push("../settingsScreens/viewProfile")}
          >
            <View style={[styles.settingsIconWrap]}>
              <MaterialIcons name="account-circle" size={30} color={"blue"} />
              <Text style={[styles.text, {}]}>

                View Profile
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={30} color={"blue"} />
          </Pressable>

          <Pressable
            style={[styles.settingsWrap, {}]}
            onPress={() => router.push("../settingsScreens/aboutUs")}
          >
            <View style={[styles.settingsIconWrap]}>
              <FontAwesome5 name="question" size={30} color={"blue"} />
              <Text style={[styles.text, {}]}>
                About Us
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={30} color={"blue"} />
          </Pressable>

          <Pressable
            style={[styles.settingsWrap, {}]}
            onPress={() => signout()}
          >
            <View style={[styles.settingsIconWrap]}>
              <Ionicons name="exit" size={30} color={"blue"} />
              <Text style={[styles.text, {}]}>
                Logout
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={30} color={"blue"} />
          </Pressable>


        </View>
      </View>
    </View>
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
    paddingTop: 60,
    backgroundColor: "white",
  },

  header: {
    flexDirection: 'row',

    height: 100,
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

    marginRight: 40,
  },

  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,

    alignSelf: 'center',

    textAlign: 'center',

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

  settingsContent: {
    flex: 1,
  },
});

