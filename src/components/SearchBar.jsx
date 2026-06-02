import React, { useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, Animated, Pressable } from "react-native";
import { Search, ArrowLeft, X } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ searchPhrase, setSearchPhrase, clearSearch }) => {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleClear = () => {
    if (clearSearch) {
      clearSearch();
    } else {
      setSearchPhrase("");
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          gap: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }),
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 1.2, 1],
              }),
            },
          ],
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <ArrowLeft color={colors.grey(0.6)} size={24} />
        </Pressable>
      </Animated.View>

      <View style={styles.bar}>
        <Search
          size={18}
          color={searchPhrase ? colors.black() : colors.grey(0.5)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Search movies..."
          placeholderTextColor={colors.grey(0.5)}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          borderWidth={0}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoFocus={true}
          returnKeyType="search"
        />
        {searchPhrase.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <X size={18} color={colors.black()} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white(),
  },
  bar: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    flex: 1,
  },
  textinput: {
    fontSize: 14,
    fontFamily: "Pjs-Medium",
    color: colors.black(),
    lineHeight: 18,
    padding: 0,
    flex: 1,
  },
});
