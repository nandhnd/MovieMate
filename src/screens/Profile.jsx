import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Settings, Heart, Clock, Star } from "lucide-react-native";
import { Image } from "expo-image";
import { colors } from "../../assets/theme";
import { MovieList } from "../data/movies";
import ItemMovie from "../components/ItemMovie";

// Data profil pengguna
const ProfileData = {
  profilePict:
    "https://static0.moviewebimages.com/wordpress/wp-content/uploads/2025/06/homelander-in-the-boys.jpg?w=1200&h=675&fit=crop",
  name: "Nanda Handika",
  username: "@nandahahaha",
  createdAt: "Jan 15, 2024",
  watchlistCount: 12,
  watchedCount: 8,
  reviewsCount: 5,
};

const ProfileScreen = () => {
  const recentActivity = MovieList.slice(0, 3);

  const renderItem = ({ item }) => (
    <ItemMovie
      item={item}
      onPress={() => console.log("Recent movie:", item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => console.log("Settings")}>
            <Settings color={colors.black()} size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: ProfileData.profilePict }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.name}>{ProfileData.name}</Text>
          <Text style={styles.username}>{ProfileData.username}</Text>
          <Text style={styles.joinDate}>Joined {ProfileData.createdAt}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Heart color={colors.blue()} size={22} />
            <Text style={styles.statNumber}>{ProfileData.watchlistCount}</Text>
            <Text style={styles.statLabel}>Watchlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Clock color={colors.blue()} size={22} />
            <Text style={styles.statNumber}>{ProfileData.watchedCount}</Text>
            <Text style={styles.statLabel}>Watched</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Star color={colors.blue()} size={22} />
            <Text style={styles.statNumber}>{ProfileData.reviewsCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log("Edit profile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((item) => (
            <ItemMovie
              key={item.id}
              item={item}
              onPress={() => console.log(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
    paddingVertical: 16,
  },
  title: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 24,
    color: colors.black(),
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontFamily: "Pjs-Bold",
    fontSize: 20,
    color: colors.black(),
  },
  username: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
    marginTop: 4,
  },
  joinDate: {
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(0.6),
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.grey(0.03),
    marginHorizontal: 24,
    borderRadius: 16,
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statNumber: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
  },
  statLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    color: colors.grey(),
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.grey(0.2),
  },
  editButton: {
    backgroundColor: colors.grey(0.08),
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  editButtonText: {
    fontFamily: "Pjs-SemiBold",
    fontSize: 14,
    color: colors.black(),
  },
  recentSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 18,
    color: colors.black(),
    marginBottom: 16,
  },
});
