import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { supabase } from "../libs/supabase";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          Alert.alert("Error", "Invalid email or password");
        } else {
          Alert.alert("Error", error.message);
        }
        return;
      }

      if (data.session) {
        navigation.replace("MainTabs");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.header}>Welcome Back!</Text>
              <Text style={styles.caption}>
                Log in to continue your movie journey
              </Text>

              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={18} color={colors.grey(0.6)} />
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor={colors.grey(0.6)}
                      value={email}
                      onChangeText={setEmail}
                      inputMode="email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={18} color={colors.grey(0.6)} />
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={colors.grey(0.6)}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!passwordVisible}
                      style={[styles.input, { flex: 1 }]}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff size={18} color={colors.grey(0.6)} />
                      ) : (
                        <Eye size={18} color={colors.grey(0.6)} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colors.blue() }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white()} />
                ) : (
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.registerLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    fontSize: 32,
    fontFamily: "Pjs-ExtraBold",
    color: colors.black(),
    marginBottom: 8,
  },
  caption: {
    fontFamily: "Pjs-Regular",
    color: colors.grey(0.6),
    fontSize: 14,
    marginBottom: 40,
  },
  form: { gap: 20 },
  label: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(0.6),
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Pjs-Regular",
    fontSize: 14,
    color: colors.black(),
    padding: 0,
  },
  bottomSection: { gap: 16 },
  loginButton: { borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  loginButtonText: {
    color: colors.white(),
    fontSize: 14,
    fontFamily: "Pjs-Bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  registerLink: { fontFamily: "Pjs-Bold", fontSize: 14, color: colors.blue() },
});
