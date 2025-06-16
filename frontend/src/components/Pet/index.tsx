import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Title, Paragraph, ProgressBar } from "react-native-paper";
import { Pet as PetType } from "../../store";

interface PetProps {
  pet: PetType;
  onPress?: () => void;
}

const Pet: React.FC<PetProps> = ({ pet, onPress }) => {
  return (
    <Card style={styles.petCard} onPress={onPress}>
      <Card.Content>
        <View style={styles.petHeader}>
          <View style={styles.petAvatar}>
            <Text style={styles.petAvatarText}>
              {/* Display different emojis based on pet type */}
              {pet.petType.toLowerCase().includes("cat")
                ? "🐱"
                : pet.petType.toLowerCase().includes("dog")
                ? "🐶"
                : pet.petType.toLowerCase().includes("bird")
                ? "🐦"
                : pet.petType.toLowerCase().includes("fish")
                ? "🐠"
                : pet.petType.toLowerCase().includes("rabbit")
                ? "🐰"
                : pet.petType.toLowerCase().includes("hamster")
                ? "🐹"
                : pet.petType.toLowerCase().includes("dinosaur")
                ? "🦖"
                : "🐾"}
            </Text>
          </View>
          <View style={styles.petInfo}>
            <Title>{pet.name}</Title>
            <Paragraph style={styles.petType}>{pet.petType}</Paragraph>
          </View>
        </View>

        <View style={styles.petStats}>
          <Text style={styles.statLabel}>Age: {pet.age}</Text>

          <Text style={styles.statLabel}>Happiness</Text>
          <ProgressBar
            progress={pet.happiness / 100}
            color={
              pet.happiness > 70
                ? "#4CAF50"
                : pet.happiness > 30
                ? "#FF9800"
                : "#F44336"
            }
            style={styles.progressBar}
          />

          <Text style={styles.statLabel}>Hunger</Text>
          <ProgressBar
            progress={pet.hunger / 100}
            color={
              pet.hunger > 70
                ? "#F44336"
                : pet.hunger > 30
                ? "#FF9800"
                : "#4CAF50"
            }
            style={styles.progressBar}
          />
        </View>

        <Text style={styles.lastInteraction}>
          Last interaction: {new Date(pet.lastInteraction).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default Pet;
