import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Bell } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { getTrendingMovies, getPopularMovies } from "../services/tmdbApi";
import { getWatchlist } from "../services/watchlistApi";
import MovieCard from "../components/MovieCard";

const categories = [
  "All",
  "Trending",
  "Popular",
  "Top Rated",
  "Action",
  "Drama",
];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Ambil data dari TMDB API
  const fetchMovies = async () => {
    try {
      const trending = await getTrendingMovies();
      const popular = await getPopularMovies();
      setTrendingMovies(trending);
      setPopularMovies(popular.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil watchlist dari MockAPI
  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
      fetchWatchlist();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    await fetchWatchlist();
    setRefreshing(false);
  };

  // Filter film berdasarkan kategori
  const getFilteredMovies = () => {
    if (selectedCategory === "Trending") return trendingMovies;
    if (selectedCategory === "Popular") return popularMovies;
    return trendingMovies; // Default
  };

  const filteredMovies = getFilteredMovies();
  const featuredMovies = trendingMovies.slice(0, 5);
  const recommendedMovies = popularMovies.slice(0, 6);

  // Animasi header
  const diffClampY = Animated.diffClamp(scrollY, 0, 100);
  const headerTranslate = diffClampY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -70],
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            <Text style={styles.sectionTitle}>Trending This Week</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredMovies.map((movie, index) => (
              <MovieCard key={movie.id} item={movie} />
            ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movies</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendedMovies.map((movie, index) => (
              <MovieCard key={movie.id} item={movie} />
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
    marginTop: 30,
    flex: 1,
    backgroundColor: colors.white(),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 10,
  },
});
