import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import SearchBar from "../components/SearchBar";
import ItemMovie from "../components/ItemMovie";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Animasi untuk search bar
  const searchAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filteredMovies = MovieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item, index }) => <ItemMovie item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
          opacity: searchAnim,
        }}
      >
        <SearchBar
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {searchQuery === "" ? (
        <Animated.View
          style={[
            styles.emptyContainer,
            {
              opacity: listAnim,
              transform: [{ scale: listAnim }],
            },
          ]}
        >
          <Text style={styles.emptyTitle}>Search for movies</Text>
          <Text style={styles.emptyText}>
            Find your favorite movies by title
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
        <Animated.FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          style={{ opacity: listAnim }}
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
