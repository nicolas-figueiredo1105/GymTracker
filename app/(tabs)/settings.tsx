import { View, Text, StyleSheet, Pressable } from 'react-native'
import {MaterialIcons} from "@expo/vector-icons";
import React from 'react';
import { useRouter } from 'expo-router';



const settings = () => {

  const router = useRouter();

  return (
    <View style = {styles.screen}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" size={30} style={styles.profileIcon} />
        <Text style = {styles.title}>Gym Tracker</Text>
      </View>
      <View style = {styles.content}>
        <Pressable
          onPress={ () => router.push('/login')}
        >
          <Text>Logout</Text>
        </Pressable>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  profileIcon: {
    position:'absolute',
    right: 20,
    top: 100,
  },

  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    height: 200,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'blue',

    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,

    marginBottom: 50,

    //iOS
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 6,

    //Android
    elevation: 5,

  },

  title: {
    color: "white",
    fontSize: 32,
    fontFamily: 'AlfaSlabOne_400Regular',

    position: 'absolute',
    top: 100,
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
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
});

export default settings