import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { Bell } from "lucide-react-native";
import { colors, fontType } from "./assets/theme";
import MovieCard from "./src/components/MovieCard";
import WatchingCard from "./src/components/WatchingCard";
import AddMovieCard from "./src/components/AddMovieCard";
import BottomNavigation from "./src/components/BottomNavigation";

// Data dummy untuk watchlist
const watchlistData = [
  {
    id: "1",
    title: "Dune: Part Two",
    rating: "8.7",
    year: "2024",
    imageUrl:
      "https://image.tmdb.org/t/p/original/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
  },
  {
    id: "2",
    title: "Oppenheimer",
    rating: "8.5",
    year: "2023",
    imageUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
  {
    id: "3",
    title: "Poor Things",
    rating: "8.0",
    year: "2023",
    imageUrl: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
  },
];

// Data dummy untuk watching
const watchingData = [
  {
    id: "1",
    title: "The Batman",
    rating: "7.9",
    progress: 65,
    imageUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    id: "2",
    title: "John Wick 4",
    rating: "8.1",
    progress: 30,
    imageUrl:
      "https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
  },
];

export default function App() {
  const [loaded] = useFonts(fontType);
  const [activeTab, setActiveTab] = useState("home");

  if (!loaded) {
    return null;
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    console.log("Tab pressed:", tab);
  };

  const handleSeeAll = (category) => {
    console.log(`See all ${category} pressed`);
  };

  const handleMoviePress = (movieId) => {
    console.log("Movie pressed:", movieId);
  };

  const handleAddMovie = () => {
    console.log("Add movie pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Header - DIPERBAIKI posisi icon notifikasi */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>MovieMate</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => console.log("Notifications")}
          activeOpacity={0.7}
        >
          <Bell color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Watchlist Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Watchlist</Text>
            <TouchableOpacity onPress={() => handleSeeAll("watchlist")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {watchlistData.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                rating={movie.rating}
                year={movie.year}
                imageUrl={movie.imageUrl}
                onPress={() => handleMoviePress(movie.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Movie Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movie</Text>
            <TouchableOpacity onPress={() => handleSeeAll("movieMeter")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <MovieCard
              title="The Zone of Interest"
              rating="8.2"
              year="2023"
              imageUrl="https://media.themoviedb.org/t/p/w440_and_h660_face/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg"
              onPress={() => handleMoviePress("meter1")}
            />
            <MovieCard
              title="Past Lives"
              rating="8.0"
              year="2023"
              imageUrl="https://media.themoviedb.org/t/p/w440_and_h660_face/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg"
              onPress={() => handleMoviePress("meter2")}
            />
            <MovieCard
              title="Avatar: Fire and Ash"
              rating="7.3"
              year="2025"
              imageUrl="https://image.tmdb.org/t/p/original/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg"
              onPress={() => handleMoviePress("meter3")}
            />
          </ScrollView>
        </View>

        {/* Watching Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Watching</Text>
            <TouchableOpacity onPress={() => handleSeeAll("watching")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {watchingData.map((movie) => (
              <WatchingCard
                key={movie.id}
                title={movie.title}
                rating={movie.rating}
                progress={movie.progress}
                imageUrl={movie.imageUrl}
                onPress={() => handleMoviePress(movie.id)}
              />
            ))}
            <AddMovieCard onPress={handleAddMovie} />
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity onPress={() => handleSeeAll("recommended")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <MovieCard
              title="Anatomy of a Fall"
              rating="7.9"
              year="2023"
              imageUrl="https://image.tmdb.org/t/p/original/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"
              onPress={() => handleMoviePress("rec1")}
            />
            <MovieCard
              title="The Holdovers"
              rating="8.0"
              year="2023"
              imageUrl="https://image.tmdb.org/t/p/original/VHSzNBTwxV8vh7wylo7O9CLdac.jpg"
              onPress={() => handleMoviePress("rec2")}
            />
            <MovieCard
              title="Saltburn"
              rating="7.5"
              year="2023"
              imageUrl="https://image.tmdb.org/t/p/original/zGTfMwG112BC66mpaveVxoWPOaB.jpg"
              onPress={() => handleMoviePress("rec3")}
            />
            <MovieCard
              title="Ferrari"
              rating="6.8"
              year="2023"
              imageUrl="https://image.tmdb.org/t/p/original/LyCOcGqOTyTmaXu2TK8LfGveIb.jpg"
              onPress={() => handleMoviePress("rec4")}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black(),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ini memastikan semua item di header sejajar vertikal
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white(),
  },
  headerLeft: {
    flexDirection: "column",
  },
  notificationButton: {
    padding: 8, // Memberikan area sentuh yang nyaman
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.grey(),
  },
  appName: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 28,
    color: colors.blue(),
  },
  section: {
    marginTop: 20,
  },
  lastSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
  },
  seeAll: {
    fontFamily: "Pjs-Medium",
    fontSize: 13,
    color: colors.blue(),
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 10,
  },
});
