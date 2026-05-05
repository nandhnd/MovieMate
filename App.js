import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import { fontType, colors } from "./assets/theme";
import Router from "./src/navigation/Router";

export default function App() {
  const [loaded] = useFonts(fontType);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
      <Router />
    </NavigationContainer>
  );
}
