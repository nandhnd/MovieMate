import { StyleSheet, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { colors } from "../../assets/theme";

const SearchBar = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.grey(0.5)} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search movies..."}
        placeholderTextColor={colors.grey(0.5)}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.black(),
    padding: 0,
  },
});
