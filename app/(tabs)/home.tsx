import { Link } from "expo-router";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import {MaterialIcons} from "@expo/vector-icons";
import fontsLoaded from '../_layout'
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";

export default function Home() {
  return (
    <View style = {styles.screen}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" style={styles.profileIcon} />
        <Text style = {styles.title}>Gym Tracker</Text>
      </View>
      <View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileIcon: {

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
    fontSize: 22,
    fontFamily: 'AlfaSlabOne_400Regular',
  },

  titleContent: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center'

  },

  content: {
    padding: 30,
  },
});

