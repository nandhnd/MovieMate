import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react-native";
import { colors } from "../../assets/theme";

// Import Screens
import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import WatchlistScreen from "../screens/Watchlist";
import AddMovieScreen from "../screens/AddMovie";
import ProfileScreen from "../screens/Profile";
import MovieDetail from "../screens/MovieDetail";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.blue(),
        tabBarInactiveTintColor: colors.grey(),
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 65,
          backgroundColor: colors.white(),
          borderTopWidth: 1,
          borderTopColor: colors.grey(0.1),
        },
        tabBarLabelStyle: {
          marginTop: 5,
          fontSize: 11,
          fontFamily: "Pjs-Medium",
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddMovieScreen}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color }) => <PlusSquare color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          tabBarLabel: "Watchlist",
          tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Router = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          animationEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          animationEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      {/* Main App */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          animationEnabled: true,
        }}
      />

      {/* Detail Screen */}
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default Router;
