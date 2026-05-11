import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react-native";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSignupDisabled, setSignupDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Validasi form registrasi
  const updateSignupButtonStatus = () => {
    if (
      fullName.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim()
    ) {
      setSignupDisabled(false);
    } else {
      setSignupDisabled(true);
    }
  };

  useEffect(() => {
    updateSignupButtonStatus();
  }, [fullName, email, password, confirmPassword]);

  // Handle registrasi dengan validasi
  const handleRegister = async () => {
    let errorMessage = "";

    // Validasi password match
    if (password !== confirmPassword) {
      errorMessage = "Password and confirmation password do not match.";
    }
    // Validasi panjang password minimal 8 karakter
    else if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters long.";
    }
    // Validasi kombinasi huruf dan angka
    else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        errorMessage =
          "Password must contain a combination of letters and numbers.";
      }
    }

    if (errorMessage) {
      Alert.alert("Registration Error", errorMessage);
      return;
    }

    setLoading(true);
    // Simulasi proses registrasi
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.innerContainer}>
              <View>
                <Text style={styles.header}>Create Account</Text>
                <Text style={styles.caption}>
                  Join MovieMate and start your movie journey
                </Text>

                <View style={styles.form}>
                  {/* Full Name Input */}
                  <View>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                      <User size={18} color={colors.grey(0.6)} />
                      <TextInput
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.grey(0.6)}
                        value={fullName}
                        onChangeText={(text) => {
                          setFullName(text);
                          updateSignupButtonStatus();
                        }}
                        style={styles.input}
                      />
                    </View>
                  </View>

                  {/* Email Input */}
                  <View>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                      <Mail size={18} color={colors.grey(0.6)} />
                      <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={colors.grey(0.6)}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          updateSignupButtonStatus();
                        }}
                        inputMode="email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock size={18} color={colors.grey(0.6)} />
                      <TextInput
                        placeholder="Create a password"
                        placeholderTextColor={colors.grey(0.6)}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          updateSignupButtonStatus();
                        }}
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
                    <Text style={styles.hintText}>
                      Min. 8 characters with letters and numbers
                    </Text>
                  </View>

                  {/* Confirm Password Input */}
                  <View>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock size={18} color={colors.grey(0.6)} />
                      <TextInput
                        placeholder="Confirm your password"
                        placeholderTextColor={colors.grey(0.6)}
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          updateSignupButtonStatus();
                        }}
                        secureTextEntry={!confirmPasswordVisible}
                        style={[styles.input, { flex: 1 }]}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                      >
                        {confirmPasswordVisible ? (
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
                  style={[
                    styles.signupButton,
                    {
                      backgroundColor: isSignupDisabled
                        ? colors.blue(0.5)
                        : colors.blue(),
                    },
                  ]}
                  onPress={handleRegister}
                  disabled={isSignupDisabled}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white()} />
                  ) : (
                    <Text style={styles.signupButtonText}>SIGN UP</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.loginLink}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 30,
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
    marginBottom: 30,
  },
  form: {
    gap: 18,
  },
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
  hintText: {
    fontFamily: "Pjs-Regular",
    fontSize: 10,
    color: colors.grey(0.5),
    marginTop: 6,
  },
  bottomSection: {
    marginTop: 30,
    gap: 16,
  },
  signupButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  signupButtonText: {
    color: colors.white(),
    fontSize: 14,
    fontFamily: "Pjs-Bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.grey(),
  },
  loginLink: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.blue(),
  },
});
