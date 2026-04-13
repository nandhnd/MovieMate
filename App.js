import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { fontType } from "./assets/theme";
import BottomNavigation from "./src/components/BottomNavigation";
import HomeScreen from "./src/screens/Home";
import SearchScreen from "./src/screens/Search";
import WatchlistScreen from "./src/screens/Watchlist";
import AddMovieScreen from "./src/screens/AddMovie";
import ProfileScreen from "./src/screens/Profile";

export default function App() {
  const [loaded] = useFonts(fontType);
  const [activeTab, setActiveTab] = useState("home");

  if (!loaded) {
    return null;
  }

  // Fungsi untuk merender screen berdasarkan tab yang aktif
  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            onMoviePress={(id) => console.log("Movie pressed:", id)}
          />
        );
      case "search":
        return <SearchScreen />;
      case "add":
        return <AddMovieScreen />;
      case "watchlist":
        return <WatchlistScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen
            onMoviePress={(id) => console.log("Movie pressed:", id)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
