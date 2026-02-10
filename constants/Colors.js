import { AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const [fontsLoaded] = useFonts({
    AlfaSlabOne_400Regular,
  });

if(!fontsLoaded) { return null };

export const Colors = {
    header: {
        font: AlfaSlabOne_400Regular,
    },

    dark: {
        color: "#fff",

    }
}
