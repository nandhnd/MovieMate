import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { supabase } from "../libs/supabase";
import { Image } from "expo-image";
import {
  Settings,
  LogOut,
  Bookmark,
  CheckCircle,
  Star,
} from "lucide-react-native";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, []),
  );

  const fetchUserProfile = async () => {
    try {
      // Ambil session user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigation.replace("Login");
        return;
      }

      setUser(session.user);

      // Ambil data profil dari tabel users
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
      }

      setProfile(
        profileData || {
          full_name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0],
          email: session.user.email,
          avatar_url:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",
          created_at: session.user.created_at,
        },
      );

      // =====================================================
      // HITUNG WATCHLIST (HANYA FILM YANG BELUM DITONTON)
      // =====================================================

      // 1. Ambil semua film di watchlist user
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlist")
        .select("movie_id")
        .eq("user_id", session.user.id);

      if (watchlistError) throw watchlistError;

      // 2. Ambil semua film yang sudah ditonton user
      const { data: watchedData, error: watchedError } = await supabase
        .from("watched")
        .select("movie_id")
        .eq("user_id", session.user.id);

      if (watchedError) throw watchedError;

      // 3. Buat Set untuk movie_id yang sudah ditonton
      const watchedMovieIds = new Set(
        watchedData?.map((item) => item.movie_id) || [],
      );

      // 4. Filter: hanya hitung film yang BELUM ada di watched
      const unwatchedCount =
        watchlistData?.filter((item) => !watchedMovieIds.has(item.movie_id))
          .length || 0;

      setWatchlistCount(unwatchedCount);

      // 5. Hitung jumlah film yang sudah ditonton
      setWatchedCount(watchedData?.length || 0);

      console.log("Watchlist total:", watchlistData?.length);
      console.log("Watched movie IDs:", watchedMovieIds);
      console.log("Unwatched count:", unwatchedCount);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <LogOut color={colors.red()} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",
            }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.name}>
            {profile?.full_name || user?.email?.split("@")[0]}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.joinDate}>
            Member since {formatDate(profile?.created_at || user?.created_at)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Bookmark color={colors.blue()} size={24} />
            <Text style={styles.statNumber}>{watchlistCount}</Text>
            <Text style={styles.statLabel}>Watchlist</Text>
            <Text style={styles.statSubLabel}>To watch</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CheckCircle color={colors.blue()} size={24} />
            <Text style={styles.statNumber}>{watchedCount}</Text>
            <Text style={styles.statLabel}>Watched</Text>
            <Text style={styles.statSubLabel}>Completed</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Watchlist")}
          >
            <Bookmark color={colors.grey()} size={22} />
            <Text style={styles.menuText}>My Watchlist</Text>
            {watchlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{watchlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Watched")}
          >
            <CheckCircle color={colors.grey()} size={22} />
            <Text style={styles.menuText}>Watched Movies</Text>
            {watchedCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{watchedCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log("Settings")}
          >
            <Settings color={colors.grey()} size={22} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text style={styles.version}>MovieMate v1.0.0</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white(),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: "Pjs-ExtraBold",
    fontSize: 24,
    color: colors.black(),
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontFamily: "Pjs-Bold",
    fontSize: 22,
    color: colors.black(),
    marginBottom: 4,
  },
  email: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
    marginBottom: 4,
  },
  joinDate: {
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(0.6),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 24,
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: colors.grey(0.03),
    borderRadius: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontFamily: "Pjs-Bold",
    fontSize: 28,
    color: colors.black(),
  },
  statLabel: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  statSubLabel: {
    fontFamily: "Pjs-Regular",
    fontSize: 10,
    color: colors.grey(0.5),
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.grey(0.2),
  },
  menuContainer: {
    marginHorizontal: 24,
    marginTop: 10,
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
  },
  menuText: {
    fontFamily: "Pjs-Medium",
    fontSize: 16,
    color: colors.black(),
    flex: 1,
  },
  badge: {
    backgroundColor: colors.blue(),
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: "Pjs-Bold",
    fontSize: 12,
    color: colors.white(),
  },
  version: {
    textAlign: "center",
    fontFamily: "Pjs-Regular",
    fontSize: 12,
    color: colors.grey(0.5),
    marginTop: 30,
  },
});
