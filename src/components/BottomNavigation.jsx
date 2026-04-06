import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react-native";

// Komponen BottomNavigation menerima props activeTab dan onTabPress
export default function BottomNavigation({ activeTab, onTabPress }) {
  const tabs = [
    { key: "home", label: "Home", icon: Home },
    { key: "search", label: "Search", icon: Search },
    { key: "add", label: "Add", icon: PlusSquare },
    { key: "watchlist", label: "Watchlist", icon: Heart },
    { key: "profile", label: "Profile", icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Icon
              color={isActive ? colors.blue() : colors.grey(0.6)}
              size={24}
              variant={isActive ? "Bold" : "Linear"}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.blue() : colors.grey(0.6) },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white(),
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.1),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontFamily: "Pjs-Medium",
    fontSize: 11,
  },
});
