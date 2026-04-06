import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Image } from "expo-image";
import { Bookmark } from "lucide-react-native";

// Komponen ini menerima props dari ListHorizontal
const ItemHorizontal = ({ item, isBookmarked, onPress }) => {
  return (
    <View style={styles.cardItem}>
      <Image
        style={styles.cardImage}
        source={{ uri: item.imageUrl }}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        transition={300}
      />
      <View style={styles.overlayContainer}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            {/* Props: menampilkan judul dari item */}
            <Text style={styles.cardTitle}>{item.title}</Text>
            {/* Props: menampilkan rating dan tahun */}
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.cardText}>{item.year}</Text>
            </View>
          </View>
          <View>
            <View style={styles.cardIcon}>
              {/* TouchableOpacity untuk menangani press */}
              <TouchableOpacity onPress={onPress}>
                <Bookmark
                  color={colors.white()}
                  fill={isBookmarked ? colors.white() : "transparent"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemHorizontal;

const styles = StyleSheet.create({
  cardItem: {
    width: 280,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.3)", // Overlay gelap agar teks terbaca
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    flex: 1,
  },
  cardInfo: {
    justifyContent: "flex-end",
    height: "100%",
    gap: 5,
    maxWidth: "70%",
  },
  cardTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.white(),
    textShadowColor: colors.black(0.75),
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    fontSize: 11,
    color: colors.white(),
    fontFamily: "Pjs-Medium",
  },
  cardText: {
    fontSize: 10,
    color: colors.white(),
    fontFamily: "Pjs-Medium",
    textShadowColor: colors.black(0.75),
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardIcon: {
    backgroundColor: colors.white(0.33),
    padding: 5,
    borderColor: colors.white(),
    borderWidth: 0.5,
    borderRadius: 5,
  },
});
