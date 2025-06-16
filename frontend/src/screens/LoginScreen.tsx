import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { AuthApi } from "../services/supabase";
import { StackNavigationProp } from "@react-navigation/stack";

type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleAuthentication = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isLogin) {
        await AuthApi.signIn(email, password);
        navigation.replace("Home");
      } else {
        await AuthApi.signUp(email, password);
        setIsLogin(true);
        setError("");
        // Show success message or automatically log in
        alert("Account created! Please sign in.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Surface style={styles.surface}>
        {" "}
        {/* Logo image with fallback */}
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
          defaultSource={require("../assets/images/logo.png")}
          // If image fails to load, show a colored box instead
          onError={(e) =>
            console.log("Image couldn't be loaded", e.nativeEvent.error)
          }
        />
        <Text style={styles.title}>
          {isLogin ? "Welcome Back!" : "Create Account"}
        </Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          disabled={loading}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          disabled={loading}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleAuthentication}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <Button
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
          disabled={loading}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f6f6f6",
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 10,
    paddingVertical: 6,
  },
  switchButton: {
    marginTop: 20,
  },
  errorText: {
    color: "#B00020",
    marginBottom: 10,
  },
});

export default LoginScreen;
