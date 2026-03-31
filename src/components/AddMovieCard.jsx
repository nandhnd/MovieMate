import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Plus } from "lucide-react-native";

// Komponen tombol untuk menambah film ke watchlist
export default function AddMovieCard({ onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Plus color={colors.blue()} size={32} />
      </View>
      <Text style={styles.text}>Add Movie</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.grey(0.05), // Warna abu-abu terang
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blue(0.1),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  text: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.blue(),
  },
});
