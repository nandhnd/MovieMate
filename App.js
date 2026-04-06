import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { Bell } from "lucide-react-native";
import { colors, fontType } from "./assets/theme";
import { MovieList } from "./src/data/movies";
import { CategoryList } from "./src/data/categories";
import MovieCard from "./src/components/MovieCard";
import WatchingCard from "./src/components/WatchingCard";
import AddMovieCard from "./src/components/AddMovieCard";
import BottomNavigation from "./src/components/BottomNavigation";
import ListHorizontal from "./src/components/ListHorizontal";

// Komponen ItemCategory untuk kategori (menerima props)
const ItemCategory = ({ item, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={category.item}>
        <Text style={[category.title, { color }]}>{item.categoryName}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Komponen FlatListCategory dengan STATE untuk selected category
const FlatListCategory = ({ onSelectCategory }) => {
  // State untuk menyimpan kategori yang dipilih
  const [selected, setSelected] = useState(1);

  const renderItem = ({ item }) => {
    const color = item.id === selected ? colors.blue() : colors.grey();
    return (
      <ItemCategory
        item={item}
        onPress={() => {
          setSelected(item.id);
          onSelectCategory(item.categoryName);
        }}
        color={color}
      />
    );
  };

  return (
    <FlatList
      data={CategoryList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default function App() {
  const [loaded] = useFonts(fontType);
  const [activeTab, setActiveTab] = useState("home");

  // STATE untuk kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState("Popular");

  // STATE untuk watchlist (film yang disimpan)
  const [watchlist, setWatchlist] = useState([]);

  if (!loaded) {
    return null;
  }

  // Filter film berdasarkan kategori yang dipilih
  const filteredMovies =
    selectedCategory === "All"
      ? MovieList
      : MovieList.filter((movie) => movie.category === selectedCategory);

  // Data untuk section horizontal (5 film pertama)
  const horizontalData = MovieList.slice(0, 5);

  // Data untuk watching (film dengan rating tertinggi)
  const watchingData = MovieList.filter((m) => m.rating > 8.0).slice(0, 3);

  // Data untuk recommended (film dari kategori yang dipilih)
  const recommendedData = filteredMovies.slice(0, 6);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    console.log("Tab pressed:", tab);
  };

  const handleMoviePress = (movieId) => {
    console.log("Movie pressed:", movieId);
    // Tambahkan ke watchlist jika belum ada
    if (!watchlist.includes(movieId)) {
      setWatchlist([...watchlist, movieId]);
    }
  };

  const handleAddMovie = () => {
    console.log("Add movie pressed");
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.appName}>MovieMate</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("Notifications")}>
          <Bell color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category Filter - Mengirim props onSelectCategory */}
        <View style={styles.listCategory}>
          <FlatListCategory onSelectCategory={handleSelectCategory} />
        </View>

        {/* Featured Section dengan ListHorizontal (menggunakan state bookmark) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity onPress={() => console.log("See all")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* Props: mengirim data ke ListHorizontal */}
          <ListHorizontal data={horizontalData} />
        </View>

        {/* Continue Watching Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Watching</Text>
            <TouchableOpacity onPress={() => console.log("See all")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {watchingData.map((movie) => (
              <WatchingCard
                key={movie.id}
                item={movie}
                onPress={handleMoviePress}
              />
            ))}
            <AddMovieCard onPress={handleAddMovie} />
          </ScrollView>
        </View>

        {/* Recommended Section - Berdasarkan kategori yang dipilih */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Text style={styles.categoryLabel}>{selectedCategory}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendedData.map((movie) => (
              <MovieCard
                key={movie.id}
                item={movie}
                onPress={handleMoviePress}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Props activeTab dan onTabPress */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

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
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white(),
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
  listCategory: {
    paddingVertical: 10,
  },
  section: {
    marginTop: 20,
  },
  lastSection: {
    marginBottom: 80,
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
  categoryLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.blue(),
  },
  seeAll: {
    fontFamily: "Pjs-Medium",
    fontSize: 13,
    color: colors.blue(),
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 10,
  },
});

const category = StyleSheet.create({
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: colors.grey(0.08),
  },
  title: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    lineHeight: 18,
  },
});
