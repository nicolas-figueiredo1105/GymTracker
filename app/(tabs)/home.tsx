import { Link } from "expo-router";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.title}>
      <Text style={styles.content}>Gym Tracker</Text>
    </View>


  );
}

const styles = StyleSheet.create({
  title: {
    flex: 0.25,
    color: "white",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: 'blue',
  },

  content: {
    fontSize: 22,
    color: "black",
    fontFamily: 'AlfaSlabOne_400Regular',
  },
});

