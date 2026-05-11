import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
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
} from "lucide-react-native";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";

const MovieDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Animasi scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  const movie = MovieList.find((m) => m.id === movieId);
  if (!movie) return null;

  // Animasi diffClamp untuk header dan bottom bar
  const diffClampY = Animated.diffClamp(scrollY, 0, 80);

  // Header translateY: bergerak ke atas saat scroll
  const headerTranslate = diffClampY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  // Header opacity: menghilang saat scroll
  const headerOpacity = diffClampY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  // Bottom bar translateY: bergerak ke bawah saat scroll
  const bottomBarTranslate = diffClampY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  // Animasi pulse untuk tombol like
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleLikePress = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    setIsLiked(!isLiked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslate }],
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.black()} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Share")}>
          <Share2 color={colors.grey(0.6)} size={22} />
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
          source={{ uri: movie.imageUrl }}
          contentFit="cover"
          transition={300}
        />

        {/* Info Film */}
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.ratingRow}>
            <Star size={16} color={colors.blue()} fill={colors.blue()} />
            <Text style={styles.rating}>{movie.rating} / 10</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{movie.category}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.grey()} />
              <Text style={styles.infoText}>Duration: 2h 30m</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Animated Bottom Bar */}
      <Animated.View
        style={[
          styles.bottomBar,
          {
            transform: [{ translateY: bottomBarTranslate }],
          },
        ]}
      >
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Heart
              color={isLiked ? colors.blue() : colors.grey(0.6)}
              fill={isLiked ? colors.blue() : "none"}
              size={24}
            />
          </Animated.View>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark
            color={isBookmarked ? colors.blue() : colors.grey(0.6)}
            fill={isBookmarked ? colors.blue() : "none"}
            size={24}
          />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => console.log("Watch now")}
        >
          <Text style={styles.watchButtonText}>Watch Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  poster: {
    width: "100%",
    height: 400,
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
  categoryBadge: {
    backgroundColor: colors.blue(0.1),
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  categoryText: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.blue(),
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
  infoSection: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
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
