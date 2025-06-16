import React from "react";
import { Button as PaperButton } from "react-native-paper";
import StatusBar from "./StatusBar";

// Export all UI components
export { StatusBar };

// Button with default styling for the app
export const Button = ({ mode = "contained", color = "#6200ee", ...props }) => {
  return <PaperButton mode={mode} buttonColor={color} {...props} />;
};
