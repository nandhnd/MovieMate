import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import SearchBar from "../components/SearchBar";
import ItemMovie from "../components/ItemMovie";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter film berdasarkan pencarian
  const filteredMovies = MovieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item }) => (
    <ItemMovie
      item={item}
      onPress={() => console.log("Movie pressed:", item.id)}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SearchBar
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchQuery === "" ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Search for movies</Text>
            <Text style={styles.emptyText}>
              Find your favorite movies by title
            </Text>
          </View>
        ) : filteredMovies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMovies}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
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
