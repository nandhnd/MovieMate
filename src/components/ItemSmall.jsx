import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Clock, MessageCircle } from "lucide-react-native";
import { colors } from "../../assets/theme";

// Komponen ini menerima props 'item' dari parent
const ItemSmall = ({ item }) => {
  return (
    <View style={styles.cardItem}>
      <Image
        style={styles.cardImage}
        source={{ uri: item.imageUrl }}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 5, flex: 1 }}>
            {/* Props: menampilkan kategori film */}
            <Text style={styles.cardCategory}>{item.category}</Text>
            {/* Props: menampilkan judul film */}
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          {/* Props: menampilkan durasi film */}
          <Clock size={10} variant="Linear" color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{item.duration || "2h"}</Text>
          {/* Props: menampilkan rating */}
          <Text style={styles.cardText}>⭐ {item.rating}</Text>
          {/* Props: menampilkan jumlah komentar */}
          <MessageCircle size={10} variant="Linear" color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{item.totalComments}</Text>
        </View>
      </View>
    </View>
  );
};

export default ItemSmall;

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: colors.blue(0.03),
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 24,
    marginVertical: 5,
  },
  cardCategory: {
    color: colors.blue(),
    fontSize: 10,
    fontFamily: "Pjs-SemiBold",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Pjs-Bold",
    color: colors.black(),
  },
  cardText: {
    fontSize: 10,
    fontFamily: "Pjs-Medium",
    color: colors.grey(0.6),
  },
  cardImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
  },
  cardInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cardContent: {
    gap: 8,
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: 15,
    flex: 1,
    paddingVertical: 10,
  },
});
