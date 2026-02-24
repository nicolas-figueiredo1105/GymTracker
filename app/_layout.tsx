import { Stack } from "expo-router";
import {useFonts, AlfaSlabOne_400Regular,} from "@expo-google-fonts/alfa-slab-one";


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
      AlfaSlabOne_400Regular,
    });
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
    </Stack>
    );
}
