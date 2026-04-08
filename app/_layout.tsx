import { AlfaSlabOne_400Regular, useFonts, } from "@expo-google-fonts/alfa-slab-one";
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
      AlfaSlabOne_400Regular,
      Poppins_400Regular,
      Poppins_700Bold
    });


  return (
    <Stack screenOptions={{ headerShown: false,}}>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation:  "slide_from_left"}}
      />
    </Stack>
    );
}
