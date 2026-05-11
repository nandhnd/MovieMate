import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Bell } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import MovieCard from "../components/MovieCard";
import WatchingCard from "../components/WatchingCard";
import AddMovieCard from "../components/AddMovieCard";

const categories = ["All", "Popular", "Top Rated", "Action", "Drama", "Comedy"];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Animasi untuk header dan bottom tab
  const scrollY = useRef(new Animated.Value(0)).current;

  // Filter film berdasarkan kategori
  const filteredMovies =
    selectedCategory === "All"
      ? MovieList
      : MovieList.filter((movie) => movie.category === selectedCategory);

  const featuredMovies = MovieList.slice(0, 5);
  const watchingMovies = MovieList.filter((m) => m.rating > 8.0).slice(0, 3);
  const recommendedMovies = filteredMovies.slice(0, 6);

  // Animasi diffClamp untuk header (menyembunyikan saat scroll ke bawah)
  const diffClampY = Animated.diffClamp(scrollY, 0, 120);

  // Header translateY: bergerak ke atas saat scroll
  const headerTranslate = diffClampY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  // Opacity header: semakin kecil saat scroll
  const headerOpacity = diffClampY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const CategoryChip = ({ label, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslate }],
            opacity: headerOpacity,
          },
        ]}
      >
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.appName}>MovieMate</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("Notifications")}>
          <Bell color={colors.black()} size={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* Animated ScrollView */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 100 }}
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingRight: 24 }}
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
            {featuredMovies.map((movie, index) => (
              <MovieCard key={movie.id} item={movie} index={index} />
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
              <WatchingCard key={movie.id} item={movie} />
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
            {recommendedMovies.map((movie, index) => (
              <MovieCard key={movie.id} item={movie} index={index} />
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
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
    paddingVertical: 12,
    backgroundColor: colors.white(),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    paddingLeft: 24,
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
    marginBottom: 30,
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
