import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
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
  CheckCircle,
} from "lucide-react-native";
import { colors } from "../../assets/theme";
import { supabase } from "../libs/supabase";
import { getMovieDetail } from "../services/tmdbApi";

const MovieDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState("");
  const [reviewText, setReviewText] = useState("");

  const scrollY = new Animated.Value(0);

  // Ambil session user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Ambil detail film
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

  // Cek status film (watchlist & watched)
  const checkMovieStatus = async () => {
    if (!session?.user) return;

    try {
      // Cek watchlist
      const { data: watchlistData } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId)
        .single();
      setIsInWatchlist(!!watchlistData);

      // Cek watched & rating
      const { data: watchedData } = await supabase
        .from("watched")
        .select("user_rating, review")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId)
        .single();
      if (watchedData) {
        setIsWatched(true);
        setUserRating(watchedData.user_rating);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  // Tandai sudah ditonton + rating (otomatis hapus dari watchlist)
  const submitRating = async () => {
    const rating = parseFloat(ratingValue);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      Alert.alert("Error", "Please enter a valid rating (0-10)");
      return;
    }

    try {
      // 1. Tambahkan ke tabel watched
      const { error: watchedError } = await supabase.from("watched").insert({
        user_id: session.user.id,
        movie_id: movieId,
        title: movie.title,
        poster_path: movie.poster_path,
        user_rating: rating,
        review: reviewText || null,
      });

      if (watchedError) throw watchedError;

      // 2. Hapus dari tabel watchlist (jika ada)
      const { error: deleteError } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);

      if (deleteError)
        console.error("Delete from watchlist error:", deleteError);

      setIsWatched(true);
      setUserRating(rating);
      setIsInWatchlist(false); // Update state watchlist
      setShowRatingModal(false);
      setRatingValue("");
      setReviewText("");

      Alert.alert("Success", `You rated ${movie.title} ${rating}/10!`);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [movieId]);

  useEffect(() => {
    if (session) {
      checkMovieStatus();
    }
  }, [session, movieId]);

  // Tambah ke watchlist
  const handleAddToWatchlist = async () => {
    if (!session?.user) {
      Alert.alert("Login Required", "Please login to add to watchlist", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    try {
      const { error } = await supabase.from("watchlist").insert({
        user_id: session.user.id,
        movie_id: movieId,
        title: movie.title,
        poster_path: movie.poster_path,
        rating: movie.vote_average,
        year: new Date(movie.release_date).getFullYear(),
      });

      if (error) throw error;
      setIsInWatchlist(true);
      Alert.alert("Success", "Movie added to watchlist!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Hapus dari watchlist
  const handleRemoveFromWatchlist = async () => {
    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);

      if (error) throw error;
      setIsInWatchlist(false);
      Alert.alert("Success", "Movie removed from watchlist");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Tandai sudah ditonton + rating
  const handleWatched = async () => {
    if (!session?.user) {
      Alert.alert("Login Required", "Please login to mark as watched");
      return;
    }
    setShowRatingModal(true);
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
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <Image
          style={styles.poster}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          contentFit="cover"
          transition={300}
        />

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

          {/* My Rating Display */}
          {isWatched && userRating && (
            <View style={styles.myRatingContainer}>
              <Text style={styles.myRatingLabel}>Your Rating:</Text>
              <View style={styles.myRatingStars}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    color={
                      star <= userRating ? colors.blue() : colors.grey(0.3)
                    }
                    fill={star <= userRating ? colors.blue() : "none"}
                  />
                ))}
              </View>
              <Text style={styles.myRatingValue}>{userRating}/10</Text>
            </View>
          )}

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
            {isInWatchlist ? "Watchlist" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleWatched}>
          {isWatched ? (
            <>
              <CheckCircle color={colors.blue()} size={24} />
              <Text style={[styles.actionText, { color: colors.blue() }]}>
                Watched
              </Text>
            </>
          ) : (
            <>
              <Heart color={colors.grey(0.6)} size={24} />
              <Text style={styles.actionText}>Watched</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      <Modal visible={showRatingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate this movie</Text>
            <Text style={styles.modalSubtitle}>{movie.title}</Text>

            <Text style={styles.modalLabel}>Rating (0-10)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., 8.5"
              placeholderTextColor={colors.grey(0.5)}
              keyboardType="numeric"
              value={ratingValue}
              onChangeText={setRatingValue}
            />

            <Text style={styles.modalLabel}>Review (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Write your review..."
              placeholderTextColor={colors.grey(0.5)}
              multiline
              numberOfLines={3}
              value={reviewText}
              onChangeText={setReviewText}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitRating}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
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
  poster: { width: "100%", height: 450 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 },
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
  rating: { fontFamily: "Pjs-SemiBold", fontSize: 14, color: colors.blue() },
  year: { fontFamily: "Pjs-Medium", fontSize: 14, color: colors.grey() },
  metaInfo: { flexDirection: "row", gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: "Pjs-Medium", fontSize: 12, color: colors.grey() },
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
  genreText: { fontFamily: "Pjs-Medium", fontSize: 12, color: colors.grey() },
  myRatingContainer: {
    backgroundColor: colors.blue(0.1),
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  myRatingLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
    marginBottom: 4,
  },
  myRatingStars: { flexDirection: "row", gap: 4, marginBottom: 4 },
  myRatingValue: { fontFamily: "Pjs-Bold", fontSize: 14, color: colors.blue() },
  section: { marginBottom: 20 },
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
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.1),
    elevation: 8,
  },
  actionButton: { alignItems: "center", gap: 4 },
  actionText: { fontFamily: "Pjs-Medium", fontSize: 12, color: colors.grey() },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white(),
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 20,
    color: colors.black(),
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
    textAlign: "center",
    marginBottom: 20,
  },
  modalLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.black(),
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: colors.grey(0.05),
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.black(),
    marginBottom: 16,
  },
  modalTextArea: { minHeight: 80, textAlignVertical: "top" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: colors.grey(0.1) },
  cancelButtonText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  submitButton: { backgroundColor: colors.blue() },
  submitButtonText: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.white(),
  },
});
