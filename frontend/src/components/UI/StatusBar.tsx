import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

interface StatusBarProps {
  label: string;
  value: number;
  maxValue?: number;
  type?: "happiness" | "hunger" | "health" | "energy" | "default";
}

const StatusBar: React.FC<StatusBarProps> = ({
  label,
  value,
  maxValue = 100,
  type = "default",
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), maxValue) / maxValue;

  // Determine color based on type and value
  const getColor = () => {
    const ratio = normalizedValue;

    switch (type) {
      case "happiness":
        return ratio > 0.7 ? "#4CAF50" : ratio > 0.3 ? "#FF9800" : "#F44336";
      case "hunger":
        return ratio > 0.7 ? "#F44336" : ratio > 0.3 ? "#FF9800" : "#4CAF50";
      case "health":
        return ratio > 0.7 ? "#4CAF50" : ratio > 0.3 ? "#FF9800" : "#F44336";
      case "energy":
        return ratio > 0.7 ? "#2196F3" : ratio > 0.3 ? "#FF9800" : "#F44336";
      default:
        return "#2196F3";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}/{maxValue}
        </Text>
      </View>
      <ProgressBar
        progress={normalizedValue}
        color={getColor()}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
});

export default StatusBar;
