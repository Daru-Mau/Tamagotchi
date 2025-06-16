import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AuthApi } from "./services/supabase";

// Screens
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import LoginScreen from "./screens/LoginScreen";

// Navigation
const Stack = createStackNavigator();

// Theme
const theme = {
  colors: {
    primary: "#6200ee",
    accent: "#03dac4",
    background: "#f6f6f6",
    surface: "white",
    text: "#000000",
    error: "#B00020",
  },
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        // Check if user is already authenticated
        const session = await AuthApi.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.warn("Error preparing app:", error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName={isAuthenticated ? "Home" : "Login"}
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: "Tamagotchi Login",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Tamagotchi" }}
              />
              <Stack.Screen
                name="Game"
                component={GameScreen}
                options={{ title: "Play With Pet" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
