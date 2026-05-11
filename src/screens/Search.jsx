import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Animated,
} from "react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import SearchBar from "../components/SearchBar";
import ItemMovie from "../components/ItemMovie";

const SearchScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState("");

  // Animasi fade in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter film berdasarkan pencarian (title atau category)
  const filteredMovies = MovieList.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchPhrase.toLowerCase()) ||
      movie.category.toLowerCase().includes(searchPhrase.toLowerCase()),
  );

  const renderItem = ({ item }) => <ItemMovie item={item} />;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
        />
      </View>

      {searchPhrase === "" ? (
        <Animated.View
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emptyTitle}>Search for movies</Text>
          <Text style={styles.emptyText}>
            Find your favorite movies by title or category
          </Text>
        </Animated.View>
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
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
