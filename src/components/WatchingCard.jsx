import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Play } from "lucide-react-native";

// Komponen untuk menampilkan film yang sedang ditonton (watching)
export default function WatchingCard({
  title,
  rating,
  imageUrl,
  progress,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.playButton}>
          <Play color={colors.white()} size={16} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
        {progress && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white(),
    // Shadow untuk membuat card terlihat mengapung
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
  progressBar: {
    height: 3,
    backgroundColor: colors.grey(0.2),
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.blue(),
    borderRadius: 2,
  },
});
