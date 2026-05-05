import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { colors } from "../../assets/theme";

const ItemMovie = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
      activeOpacity={0.8}
    >
      <Image
        style={styles.cardImage}
        source={{ uri: item.imageUrl }}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.year}>{item.year}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemMovie;

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: "row",
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    color: colors.black(),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
  },
  year: {
    fontFamily: "Pjs-Regular",
    fontSize: 11,
    color: colors.grey(0.6),
  },
  categoryBadge: {
    backgroundColor: colors.blue(0.1),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 10,
    color: colors.blue(),
  },
});
