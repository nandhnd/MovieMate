import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistApi";
import ItemMovie from "../components/ItemMovie";
import { Trash } from "lucide-react-native";

const WatchlistScreen = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Ambil watchlist dari MockAPI
  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWatchlist();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWatchlist();
    setRefreshing(false);
  };

  // Hapus dari watchlist
  const handleRemove = (id, title) => {
    Alert.alert(
      "Remove from Watchlist",
      `Are you sure you want to remove "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeFromWatchlist(id);
            if (success) {
              setWatchlist(watchlist.filter((item) => item.id !== id));
              Alert.alert("Success", "Movie removed from watchlist");
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ItemMovie
        item={{
          id: item.movieId,
          title: item.title,
          rating: item.rating,
          year: item.year,
          imageUrl: `https://image.tmdb.org/t/p/w500${item.posterPath}`,
          category: "Watchlist",
        }}
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemove(item.id, item.title)}
      >
        <Trash color={colors.red()} size={20} />
      </TouchableOpacity>
    </View>
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
        <Text style={styles.title}>My Watchlist</Text>
        <Text style={styles.count}>{watchlist.length} movies</Text>
      </View>

      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.emptyText}>Add movies from the detail page</Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
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

export default WatchlistScreen;

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
  title: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 24,
    color: colors.black(),
  },
  count: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginRight: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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
