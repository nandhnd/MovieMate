import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Bell } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import MovieCard from "../components/MovieCard";
import WatchingCard from "../components/WatchingCard";
import AddMovieCard from "../components/AddMovieCard";

// Data untuk kategori
const categories = ["All", "Popular", "Top Rated", "Action", "Drama", "Comedy"];

const HomeScreen = ({ onMoviePress }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter film berdasarkan kategori
  const filteredMovies =
    selectedCategory === "All"
      ? MovieList
      : MovieList.filter((movie) => movie.category === selectedCategory);

  // Data untuk section
  const featuredMovies = MovieList.slice(0, 5);
  const watchingMovies = MovieList.filter((m) => m.rating > 8.0).slice(0, 3);
  const recommendedMovies = filteredMovies.slice(0, 6);

  const CategoryChip = ({ label, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.appName}>MovieMate</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("Notifications")}>
          <Bell color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity onPress={() => console.log("See all")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} onPress={onMoviePress} />
            ))}
          </ScrollView>
        </View>

        {/* Continue Watching */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Watching</Text>
            <TouchableOpacity onPress={() => console.log("See all")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {watchingMovies.map((movie) => (
              <WatchingCard
                key={movie.id}
                item={movie}
                onPress={onMoviePress}
              />
            ))}
            <AddMovieCard onPress={() => console.log("Add movie")} />
          </ScrollView>
        </View>

        {/* Recommended */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Text style={styles.categoryLabel}>{selectedCategory}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} onPress={onMoviePress} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
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
  categoriesScroll: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grey(0.08),
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: colors.blue(),
  },
  chipText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  chipTextActive: {
    color: colors.white(),
  },
  section: {
    marginTop: 20,
  },
  lastSection: {
    marginBottom: 80,
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
  categoryLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.blue(),
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
