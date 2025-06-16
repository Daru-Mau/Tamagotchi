import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import {
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Divider,
  IconButton,
} from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState, updatePet } from "../store";
import { PetApi } from "../services/api";
import LottieView from "lottie-react-native";

type GameScreenProps = {
  route: RouteProp<{ params: { petId: string } }, "params">;
  navigation: StackNavigationProp<any>;
};

const GameScreen: React.FC<GameScreenProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { petId } = route.params;

  // Get the pet from the Redux store
  const pet = useSelector((state: RootState) =>
    state.pets.pets.find((p) => p.id === petId)
  );

  // Animation values
  const [feedAnimation] = useState(new Animated.Value(0));
  const [playAnimation] = useState(new Animated.Value(0));
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Navigation options
  useEffect(() => {
    if (pet) {
      navigation.setOptions({
        title: `${pet.name} the ${pet.petType}`,
      });
    }
  }, [navigation, pet]);

  // Handle feeding the pet
  const handleFeedPet = async () => {
    if (!pet || isFeeding) return;

    setIsFeeding(true);

    // Start feed animation
    Animated.timing(feedAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(async () => {
      try {
        // Call API to feed the pet
        const updatedPet = await PetApi.feedPet(petId, 10);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Reset animation and state
        feedAnimation.setValue(0);
        setIsFeeding(false);
      } catch (err) {
        console.error("Error feeding pet:", err);
        setError("Failed to feed pet. Try again.");
        setIsFeeding(false);
        feedAnimation.setValue(0);
      }
    });
  };

  // Handle playing with the pet
  const handlePlayWithPet = async () => {
    if (!pet || isPlaying) return;

    setIsPlaying(true);

    // Start play animation
    Animated.timing(playAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(async () => {
      try {
        // Call API to play with the pet
        const updatedPet = await PetApi.playWithPet(petId, 15);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Reset animation and state
        playAnimation.setValue(0);
        setIsPlaying(false);
      } catch (err) {
        console.error("Error playing with pet:", err);
        setError("Failed to play with pet. Try again.");
        setIsPlaying(false);
        playAnimation.setValue(0);
      }
    });
  };

  // If the pet is not found, show an error message
  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pet not found!</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pet Display Area */}
      <Card style={styles.petCard}>
        <Card.Content style={styles.petCardContent}>
          {/* Pet Animation/Image */}
          <View style={styles.petImageContainer}>
            {/* In a real app, you would use an actual pet image or animation here */}
            <View style={styles.petImage}>
              <Text style={styles.petImageText}>🐱</Text>
            </View>

            {/* Show animation effects when feeding or playing */}
            {isFeeding && (
              <Animated.View
                style={[styles.animationEffect, { opacity: feedAnimation }]}
              >
                <Text style={styles.animationText}>🍕</Text>
              </Animated.View>
            )}

            {isPlaying && (
              <Animated.View
                style={[styles.animationEffect, { opacity: playAnimation }]}
              >
                <Text style={styles.animationText}>🎾</Text>
              </Animated.View>
            )}
          </View>

          {/* Pet Info */}
          <View style={styles.petInfo}>
            <Title>{pet.name}</Title>
            <Paragraph>Type: {pet.petType}</Paragraph>
            <Paragraph>Age: {pet.age}</Paragraph>

            {/* Status Bars */}
            <Text>Happiness</Text>
            <ProgressBar
              progress={pet.happiness / 100}
              color="#4CAF50"
              style={styles.progressBar}
            />

            <Text>Hunger</Text>
            <ProgressBar
              progress={pet.hunger / 100}
              color="#FF9800"
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Error message */}
      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorCardText}>{error}</Text>
            <Button onPress={() => setError(null)}>Dismiss</Button>
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="food"
          onPress={handleFeedPet}
          style={styles.actionButton}
          disabled={isFeeding || isPlaying}
        >
          Feed Pet
        </Button>

        <Button
          mode="contained"
          icon="play"
          onPress={handlePlayWithPet}
          style={styles.actionButton}
          disabled={isFeeding || isPlaying}
        >
          Play with Pet
        </Button>
      </View>

      {/* Pet Statistics */}
      <Card style={styles.statsCard}>
        <Card.Title title="Pet Statistics" />
        <Card.Content>
          <Text style={styles.statText}>
            Created: {new Date(pet.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.statText}>
            Last Interaction:{" "}
            {new Date(pet.lastInteraction).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  petCard: {
    marginBottom: 16,
    elevation: 2,
  },
  petCardContent: {
    flexDirection: "row",
  },
  petImageContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  petImage: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  petImageText: {
    fontSize: 50,
  },
  petInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsCard: {
    marginTop: 8,
  },
  statText: {
    marginBottom: 8,
    fontSize: 14,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    marginBottom: 16,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    marginBottom: 16,
  },
  errorCardText: {
    color: "#d32f2f",
    marginBottom: 8,
  },
  animationEffect: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  animationText: {
    fontSize: 30,
  },
});

export default GameScreen;
