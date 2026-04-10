import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
  


export default function Home() {

  const auth = getAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState(0);

  const [streakUpdated, setStreakUpdated] = useState(false);

  const loadUser = async () => {
    const userData = await getUserData();

    if (!userData) return;

    setFirstName(userData.first_name);
    setStreak(userData.streak || 0);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        updateStreak();
      }
    });
    return unsubscribe;
  }, []);

  const getUserData = async () => {
    const user = auth.currentUser;

    if(!user){
      console.log("No user logged in.");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      console.log("User data:" , docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such user")
      return null;
    }
  };

  const getFirstName = async () => {
    const userData = await getUserData();
    if(userData != null){
      return userData?.first_name;
    }
    return;
  }


  const updateStreak = async () => {
    const user = auth.currentUser;

    if(!user) return;

    const ref = collection(db, "users", user.uid, "workoutHistory");
    const q = query(ref, orderBy("date", "desc"), limit(1));
    const snap = await getDocs(q);

    if(snap.empty) return;

    const lastWorkout = snap.docs[0].data().date.toDate().toLocaleDateString("en-CA");
    const today = new Date().toLocaleDateString("en-CA");


    const yesterday = () => { 
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toLocaleDateString("en-CA");
    }
      
    
    
    if((lastWorkout === yesterday() && streakUpdated === false)){
      setStreak((prev) => prev + 1);
      setStreakUpdated(true);
    } else if (lastWorkout == today){
      return;
    } else {
      setStreak(0);
      setStreakUpdated(false);
    }

    await updateDoc(doc(db, "users", user.uid), {
      streak: streak,
    });
  }

  return (
    <SafeAreaView style = {styles.screen}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={20} style={styles.iconLogo} />
        <Text style = {styles.title}>Gym Tracker</Text>
        <Ionicons name="flame" size={25}/>
        <Text style = {[styles.title, {marginRight: 15,}]}>{streak}</Text>
        <MaterialIcons name="account-circle" size={30} onPress={() => router.replace("/(tabs)/settings")}/>
      </View>
      <View style = {styles.content}>
        <View style={styles.dashBoard}>
          <Text style = {styles.title}>Hello {firstName},</Text>
        </View>

        <ScrollView>

        </ScrollView>
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
    flexDirection: 'row',

    height: 100,
    alignItems: 'center',

    textAlign: 'left',

    marginBottom: 50,
    marginHorizontal: 20,

    //iOS
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 1},
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

  titleContent: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center'

  },

  content: {
    paddingLeft: 30,
    paddingRight: 30,
  },

  dashBoard: {
    
  },

  dashBoardText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
});

