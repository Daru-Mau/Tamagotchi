import React from "react";
import { Button as PaperButton } from "react-native-paper";
import StatusBar from "./StatusBar";

// Export all UI components
export { StatusBar };

// Button with default styling for the app
export const Button = ({
  mode = "contained",
  color = "#6200ee",
  ...props
}: {
  mode?: "text" | "contained" | "outlined" | "elevated" | "contained-tonal";
  color?: string;
  [key: string]: any;
}) => {
  return (
    <PaperButton
      children={undefined}
      mode={mode}
      buttonColor={color}
      {...props}
    />
  );
};
