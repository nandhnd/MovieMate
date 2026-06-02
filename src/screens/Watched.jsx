import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { supabase } from "../libs/supabase";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";

const WatchedScreen = () => {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [session, setSession] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getSession();
    }, []),
  );

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      fetchWatched(session.user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchWatched = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("watched")
        .select("*")
        .eq("user_id", userId)
        .order("watched_at", { ascending: false });

      if (error) throw error;
      setWatched(data || []);
    } catch (error) {
      console.error("Error fetching watched:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (session?.user) {
      await fetchWatched(session.user.id);
    }
    setRefreshing(false);
  };

  const goToMovieDetail = (movieId) => {
    navigation.navigate("MovieDetail", { movieId });
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= rating ? colors.blue() : colors.grey(0.3)}
            fill={star <= rating ? colors.blue() : "none"}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => goToMovieDetail(item.movie_id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
        contentFit="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {renderStars(item.user_rating)}
        <Text style={styles.ratingValue}>Rating: {item.user_rating}/10</Text>
        {item.review && (
          <Text style={styles.review} numberOfLines={2}>
            "{item.review}"
          </Text>
        )}
        <Text style={styles.date}>
          Watched on {new Date(item.watched_at).toLocaleDateString()}
        </Text>
      </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watched Movies</Text>
        <Text style={styles.headerCount}>{watched.length} movies</Text>
      </View>

      {watched.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No watched movies yet</Text>
          <Text style={styles.emptyText}>
            Rate movies you've watched from the detail page
          </Text>
        </View>
      ) : (
        <FlatList
          data={watched}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default WatchedScreen;

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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 24,
    color: colors.black(),
  },
  headerCount: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    overflow: "hidden",
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  title: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.black(),
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingValue: {
    fontFamily: "Pjs-Medium",
    fontSize: 11,
    color: colors.blue(),
  },
  review: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
    fontStyle: "italic",
  },
  date: {
    fontFamily: "Pjs-Regular",
    fontSize: 10,
    color: colors.grey(0.6),
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
});
