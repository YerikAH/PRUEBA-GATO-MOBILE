import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  useFonts,
} from "@expo-google-fonts/montserrat";

export const montserratFonts = {
  thin: "Montserrat_100Thin",
  extraLight: "Montserrat_200ExtraLight",
  light: "Montserrat_300Light",
  regular: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semiBold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
  extraBold: "Montserrat_800ExtraBold",
  black: "Montserrat_900Black",
};

export const useMontserratFonts = () => {
  return useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 30,
  "5xl": 36,
  "6xl": 48,
};

export const fontStyles = {
  thin: {
    fontFamily: montserratFonts.thin,
  },
  extraLight: {
    fontFamily: montserratFonts.extraLight,
  },
  light: {
    fontFamily: montserratFonts.light,
  },
  regular: {
    fontFamily: montserratFonts.regular,
  },
  medium: {
    fontFamily: montserratFonts.medium,
  },
  semiBold: {
    fontFamily: montserratFonts.semiBold,
  },
  bold: {
    fontFamily: montserratFonts.bold,
  },
  extraBold: {
    fontFamily: montserratFonts.extraBold,
  },
  black: {
    fontFamily: montserratFonts.black,
  },
};
