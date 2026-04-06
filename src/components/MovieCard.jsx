import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";

// Komponen MovieCard menerima props dari parent
export default function MovieCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.year}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
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
    height: 200,
  },
  overlay: {
    padding: 10,
    backgroundColor: colors.white(),
  },
  title: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    color: colors.black(),
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  star: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    fontFamily: "Pjs-Medium",
    fontSize: 11,
    color: colors.grey(),
  },
  year: {
    fontFamily: "Pjs-Regular",
    fontSize: 10,
    color: colors.grey(0.6),
  },
});
