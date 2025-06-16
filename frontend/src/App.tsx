import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Screens
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";

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
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
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
