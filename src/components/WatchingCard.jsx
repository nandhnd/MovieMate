import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { Play } from "lucide-react-native";

export default function WatchingCard({ item }) {
  const navigation = useNavigation();

  // Animasi fade in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Play color={colors.white()} size={16} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white(),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 130,
  },
  overlay: {
    padding: 10,
    backgroundColor: colors.white(),
  },
  playButton: {
    position: "absolute",
    top: -25,
    right: 10,
    backgroundColor: colors.blue(),
    borderRadius: 25,
    padding: 8,
    elevation: 2,
  },
  info: {
    marginTop: 5,
  },
  title: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 13,
    color: colors.black(),
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 10,
    marginRight: 4,
  },
  rating: {
    fontFamily: "Pjs-Medium",
    fontSize: 10,
    color: colors.grey(),
  },
});
