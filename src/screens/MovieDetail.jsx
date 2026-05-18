import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Star,
  Clock,
  Calendar,
} from "lucide-react-native";
import { colors } from "../../assets/theme";
import { getMovieDetail } from "../services/tmdbApi";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../services/watchlistApi";

const MovieDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);

  const scrollY = new Animated.Value(0);

  // Ambil detail film dari TMDB API
  const fetchMovieDetail = async () => {
    try {
      const data = await getMovieDetail(movieId);
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil watchlist dan cek apakah film sudah ada
  const checkWatchlist = async () => {
    try {
      const watchlist = await getWatchlist();
      const existing = watchlist.find((item) => item.movieId === movieId);
      if (existing) {
        setIsInWatchlist(true);
        setWatchlistId(existing.id);
      }
    } catch (error) {
      console.error("Error checking watchlist:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
    checkWatchlist();
  }, [movieId]);

  // Tambah ke watchlist (POST ke MockAPI)
  const handleAddToWatchlist = async () => {
    try {
      const watchlistData = {
        movieId: movie.id,
        title: movie.title,
        rating: movie.vote_average.toFixed(1),
        year: new Date(movie.release_date).getFullYear(),
        posterPath: movie.poster_path,
      };

      const result = await addToWatchlist(watchlistData);
      if (result) {
        setIsInWatchlist(true);
        setWatchlistId(result.id);
        Alert.alert("Success", "Movie added to watchlist!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add to watchlist");
    }
  };

  // Hapus dari watchlist (DELETE ke MockAPI)
  const handleRemoveFromWatchlist = async () => {
    try {
      const success = await removeFromWatchlist(watchlistId);
      if (success) {
        setIsInWatchlist(false);
        setWatchlistId(null);
        Alert.alert("Success", "Movie removed from watchlist!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to remove from watchlist");
    }
  };

  const handleWatchlistPress = () => {
    if (isInWatchlist) {
      handleRemoveFromWatchlist();
    } else {
      handleAddToWatchlist();
    }
  };

  // Animasi header
  const diffClampY = Animated.diffClamp(scrollY, 0, 80);
  const headerTranslate = diffClampY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
      </View>
    );
  }

  if (!movie) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.white()} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Share")}>
          <Share2 color={colors.white()} size={22} />
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
      >
        {/* Poster Film */}
        <Image
          style={styles.poster}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          contentFit="cover"
          transition={300}
        />

        {/* Info Film */}
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.ratingRow}>
            <Star size={16} color={colors.blue()} fill={colors.blue()} />
            <Text style={styles.rating}>
              {movie.vote_average.toFixed(1)} / 10
            </Text>
            <Text style={styles.year}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.grey(0.6)} />
              <Text style={styles.metaText}>{movie.runtime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.grey(0.6)} />
              <Text style={styles.metaText}>
                {new Date(movie.release_date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.genresContainer}>
            {movie.genres?.slice(0, 3).map((genre) => (
              <View key={genre.id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Sinopsis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis}>
              {movie.overview || "No description available."}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Like pressed")}
        >
          <Heart color={colors.grey(0.6)} size={24} />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleWatchlistPress}
        >
          <Bookmark
            color={isInWatchlist ? colors.blue() : colors.grey(0.6)}
            fill={isInWatchlist ? colors.blue() : "none"}
            size={24}
          />
          <Text
            style={[
              styles.actionText,
              isInWatchlist && { color: colors.blue() },
            ]}
          >
            {isInWatchlist ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => console.log("Watch now")}
        >
          <Text style={styles.watchButtonText}>Watch Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  poster: {
    width: "100%",
    height: 450,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 28,
    color: colors.black(),
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  rating: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    color: colors.blue(),
  },
  year: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  metaInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  genreBadge: {
    backgroundColor: colors.grey(0.1),
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  genreText: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
    marginBottom: 10,
  },
  synopsis: {
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.grey(),
    lineHeight: 22,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white(),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.1),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
  },
  watchButton: {
    backgroundColor: colors.blue(),
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  watchButtonText: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.white(),
  },
});
