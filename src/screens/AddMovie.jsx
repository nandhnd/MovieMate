import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../../assets/theme";
import { Image } from "expo-image";
import { Plus, X } from "lucide-react-native";

const AddMovieScreen = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const categories = ["Popular", "Top Rated", "Action", "Drama", "Comedy"];

  const handleSubmit = () => {
    if (!title || !rating || !year) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", `Movie "${title}" added to watchlist!`);
    setTitle("");
    setRating("");
    setYear("");
    setCategory("");
    setImageUrl("");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Movie</Text>
          </View>

          {/* Preview Image */}
          <View style={styles.previewContainer}>
            {imageUrl ? (
              <View style={styles.previewWrapper}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setImageUrl("")}
                >
                  <X color={colors.white()} size={16} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.previewPlaceholder}>
                <Plus color={colors.grey(0.5)} size={32} />
                <Text style={styles.previewText}>Movie Poster Preview</Text>
              </View>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter movie title"
              placeholderTextColor={colors.grey(0.5)}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Rating *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8.5"
              placeholderTextColor={colors.grey(0.5)}
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Year *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2024"
              placeholderTextColor={colors.grey(0.5)}
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Image URL (Poster)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              placeholderTextColor={colors.grey(0.5)}
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Add to Watchlist</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AddMovieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 24,
    color: colors.black(),
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  previewWrapper: {
    position: "relative",
  },
  previewImage: {
    width: 160,
    height: 220,
    borderRadius: 12,
  },
  removeImage: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.grey(),
    borderRadius: 12,
    padding: 4,
  },
  previewPlaceholder: {
    width: 160,
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.grey(0.08),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderStyle: "dashed",
  },
  previewText: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(0.5),
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  label: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    color: colors.black(),
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.grey(0.05),
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.black(),
  },
  categoryScroll: {
    flexDirection: "row",
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grey(0.08),
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.blue(),
  },
  categoryText: {
    fontFamily: "Pjs-Medium",
    fontSize: 13,
    color: colors.grey(),
  },
  categoryTextActive: {
    color: colors.white(),
  },
  submitButton: {
    backgroundColor: colors.blue(),
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 32,
  },
  submitText: {
    fontFamily: "Pjs-Bold",
    fontSize: 16,
    color: colors.white(),
  },
});
