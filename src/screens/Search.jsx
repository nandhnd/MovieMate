import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { searchMovies } from "../services/tmdbApi";
import SearchBar from "../components/SearchBar";
import { Image } from "expo-image";
import { Star, TrendingUp } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([
    "Dune",
    "Oppenheimer",
    "The Batman",
    "John Wick",
    "Avatar",
  ]);
  const navigation = useNavigation();

  // Load recent searches from storage (bisa ditambahkan AsyncStorage nanti)
  useFocusEffect(
    useCallback(() => {
      // Reset search saat halaman dibuka
      setSearchPhrase("");
      setSearchResults([]);
    }, []),
  );

  // Handle search
  const handleSearch = async (text) => {
    setSearchPhrase(text);

    if (text.trim().length > 0) {
      setLoading(true);
      const results = await searchMovies(text);
      setSearchResults(results.results || []);
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  // Save to recent searches
  const saveToRecent = (query) => {
    if (!recentSearches.includes(query) && query.trim()) {
      setRecentSearches([query, ...recentSearches].slice(0, 5));
    }
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate("MovieDetail", { movieId });
  };

  const handleRecentPress = (query) => {
    setSearchPhrase(query);
    handleSearch(query);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setSearchPhrase("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => handleMoviePress(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
        contentFit="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingRow}>
          <Star size={14} color={colors.blue()} fill={colors.blue()} />
          <Text style={styles.rating}>
            {item.vote_average?.toFixed(1)} / 10
          </Text>
          <Text style={styles.year}>
            {item.release_date
              ? new Date(item.release_date).getFullYear()
              : "N/A"}
          </Text>
        </View>
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || "No description available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => {
        setSearchPhrase(item);
        handleSearch(item);
        saveToRecent(item);
      }}
    >
      <TrendingUp size={16} color={colors.blue()} />
      <Text style={styles.trendingText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleRecentPress(item)}
    >
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  // Tampilkan hasil pencarian
  if (searchPhrase.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={handleSearch}
          clearSearch={clearSearch}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue()} />
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    );
  }

  // Tampilkan halaman awal (trending & recent)
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={handleSearch}
        clearSearch={clearSearch}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Trending Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Searches</Text>
          <FlatList
            data={trendingSearches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTrendingItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRecentItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Search Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Search Tips</Text>
          <Text style={styles.tipsText}>• Search by movie title</Text>
          <Text style={styles.tipsText}>
            • Try using English titles for better results
          </Text>
          <Text style={styles.tipsText}>
            • Check spelling for accurate results
          </Text>
        </View>
      </FlatList>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
    marginBottom: 12,
  },
  trendingList: {
    gap: 12,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.grey(0.08),
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  trendingText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.black(),
  },
  recentItem: {
    backgroundColor: colors.grey(0.05),
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  recentText: {
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.grey(),
  },
  tipsContainer: {
    backgroundColor: colors.blue(0.05),
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  tipsTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.blue(),
    marginBottom: 8,
  },
  tipsText: {
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(),
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.grey(),
    textAlign: "center",
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  movieItem: {
    flexDirection: "row",
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  movieTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 16,
    color: colors.black(),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.blue(),
  },
  year: {
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(),
  },
  overview: {
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(0.7),
    lineHeight: 16,
  },
});
