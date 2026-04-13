import React from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import ItemMovie from "../components/ItemMovie";

// Data watchlist (film yang disimpan pengguna)
const watchlistData = MovieList.slice(0, 4);

const WatchlistScreen = () => {
  const renderItem = ({ item }) => (
    <ItemMovie
      item={item}
      onPress={() => console.log("Watchlist item:", item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Watchlist</Text>
        <Text style={styles.count}>{watchlistData.length} movies</Text>
      </View>

      {watchlistData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.emptyText}>Add movies to watch later</Text>
        </View>
      ) : (
        <FlatList
          data={watchlistData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
