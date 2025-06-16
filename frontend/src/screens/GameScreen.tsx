import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Divider,
  IconButton,
  ActivityIndicator,
  List,
  Chip,
} from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState, updatePet } from "../store";
import { PetApi } from "../services/api";
import { PetInteractionApi, PetInteraction } from "../services/interaction-api";
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
  const [cleanAnimation] = useState(new Animated.Value(0));
  const [sleepAnimation] = useState(new Animated.Value(0));
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);

  // Interactions history
  const [recentInteractions, setRecentInteractions] = useState<
    PetInteraction[]
  >([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);

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

  // Fetch pet's interaction history
  useEffect(() => {
    const fetchInteractions = async () => {
      if (!pet) return;

      setLoadingInteractions(true);
      try {
        const interactions = await PetInteractionApi.fetchPetInteractions(
          petId
        );
        setRecentInteractions(interactions.slice(0, 10)); // Get the 10 most recent interactions
        setError(null);
      } catch (err) {
        console.error("Error fetching pet interactions:", err);
        setError("Failed to load interaction history.");
      } finally {
        setLoadingInteractions(false);
      }
    };

    fetchInteractions();
  }, [pet, petId]);

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
        // Create a feed interaction using the new API
        const interaction = await PetInteractionApi.feedPet(petId, 10);

        // Fetch the updated pet after the interaction
        const updatedPet = await PetApi.fetchPetById(petId);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Add the new interaction to the recent interactions list
        setRecentInteractions((prevInteractions) => [
          interaction,
          ...prevInteractions.slice(0, 9),
        ]);

        // Reset animation and state
        feedAnimation.setValue(0);
        setIsFeeding(false);
        setError(null);
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
        // Create a play interaction using the new API
        const interaction = await PetInteractionApi.playWithPet(petId, 15);

        // Fetch the updated pet after the interaction
        const updatedPet = await PetApi.fetchPetById(petId);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Add the new interaction to the recent interactions list
        setRecentInteractions((prevInteractions) => [
          interaction,
          ...prevInteractions.slice(0, 9),
        ]);

        // Reset animation and state
        playAnimation.setValue(0);
        setIsPlaying(false);
        setError(null);
      } catch (err) {
        console.error("Error playing with pet:", err);
        setError("Failed to play with pet. Try again.");
        setIsPlaying(false);
        playAnimation.setValue(0);
      }
    });
  };

  // Handle cleaning the pet
  const handleCleanPet = async () => {
    if (!pet || isCleaning) return;

    setIsCleaning(true);

    // Start clean animation
    Animated.timing(cleanAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(async () => {
      try {
        // Create a clean interaction using the new API
        const interaction = await PetInteractionApi.cleanPet(petId);

        // Fetch the updated pet after the interaction
        const updatedPet = await PetApi.fetchPetById(petId);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Add the new interaction to the recent interactions list
        setRecentInteractions((prevInteractions) => [
          interaction,
          ...prevInteractions.slice(0, 9),
        ]);

        // Reset animation and state
        cleanAnimation.setValue(0);
        setIsCleaning(false);
        setError(null);
      } catch (err) {
        console.error("Error cleaning pet:", err);
        setError("Failed to clean pet. Try again.");
        setIsCleaning(false);
        cleanAnimation.setValue(0);
      }
    });
  };

  // Handle putting the pet to sleep
  const handleSleepPet = async () => {
    if (!pet || isSleeping) return;

    setIsSleeping(true);

    // Start sleep animation
    Animated.timing(sleepAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(async () => {
      try {
        // Create a sleep interaction using the new API
        const interaction = await PetInteractionApi.sleepPet(petId);

        // Fetch the updated pet after the interaction
        const updatedPet = await PetApi.fetchPetById(petId);

        // Update the pet in the Redux store
        dispatch(updatePet(updatedPet));

        // Add the new interaction to the recent interactions list
        setRecentInteractions((prevInteractions) => [
          interaction,
          ...prevInteractions.slice(0, 9),
        ]);

        // Reset animation and state
        sleepAnimation.setValue(0);
        setIsSleeping(false);
        setError(null);
      } catch (err) {
        console.error("Error putting pet to sleep:", err);
        setError("Failed to put pet to sleep. Try again.");
        setIsSleeping(false);
        sleepAnimation.setValue(0);
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

  // Helper functions for formatting interactions
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getInteractionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "feed":
        return "food";
      case "play":
        return "play";
      case "clean":
        return "broom";
      case "sleep":
        return "sleep";
      default:
        return "gesture-tap";
    }
  };

  const getInteractionChipStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "feed":
        return { backgroundColor: "#FFECB3" };
      case "play":
        return { backgroundColor: "#C8E6C9" };
      case "clean":
        return { backgroundColor: "#B3E5FC" };
      case "sleep":
        return { backgroundColor: "#D1C4E9" };
      default:
        return { backgroundColor: "#EFEBE9" };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loadingInteractions}
          onRefresh={async () => {
            setLoadingInteractions(true);
            try {
              const interactions = await PetInteractionApi.fetchPetInteractions(
                petId
              );
              setRecentInteractions(interactions.slice(0, 10));
              const updatedPet = await PetApi.fetchPetById(petId);
              dispatch(updatePet(updatedPet));
              setError(null);
            } catch (err) {
              console.error("Error refreshing pet data:", err);
              setError("Failed to refresh pet data.");
            } finally {
              setLoadingInteractions(false);
            }
          }}
        />
      }
    >
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

            {isCleaning && (
              <Animated.View
                style={[styles.animationEffect, { opacity: cleanAnimation }]}
              >
                <Text style={styles.animationText}>🧼</Text>
              </Animated.View>
            )}

            {isSleeping && (
              <Animated.View
                style={[styles.animationEffect, { opacity: sleepAnimation }]}
              >
                <Text style={styles.animationText}>💤</Text>
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
          disabled={isFeeding || isPlaying || isCleaning || isSleeping}
        >
          Feed Pet
        </Button>

        <Button
          mode="contained"
          icon="play"
          onPress={handlePlayWithPet}
          style={styles.actionButton}
          disabled={isFeeding || isPlaying || isCleaning || isSleeping}
        >
          Play with Pet
        </Button>

        <Button
          mode="contained"
          icon="broom"
          onPress={handleCleanPet}
          style={styles.actionButton}
          disabled={isFeeding || isPlaying || isCleaning || isSleeping}
        >
          Clean Pet
        </Button>

        <Button
          mode="contained"
          icon="sleep"
          onPress={handleSleepPet}
          style={styles.actionButton}
          disabled={isFeeding || isPlaying || isCleaning || isSleeping}
        >
          Sleep Pet
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

      {/* Interaction History */}
      <Card style={styles.historyCard}>
        <Card.Title title="Interaction History" />
        <Card.Content>
          {loadingInteractions ? (
            <ActivityIndicator />
          ) : recentInteractions.length > 0 ? (
            <ScrollView
              style={styles.historyList}
              refreshControl={
                <RefreshControl
                  refreshing={loadingInteractions}
                  onRefresh={() => {}}
                />
              }
            >
              {recentInteractions.map((interaction) => (
                <List.Item
                  key={interaction.id}
                  title={interaction.type}
                  description={`Pet: ${interaction.petId} - Time: ${new Date(
                    interaction.timestamp
                  ).toLocaleString()}`}
                  left={(props) => <List.Icon {...props} icon="history" />}
                  style={styles.historyItem}
                />
              ))}
            </ScrollView>
          ) : (
            <Text>No interaction history available.</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
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
  historyCard: {
    marginTop: 16,
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    paddingVertical: 8,
  },
});

export default GameScreen;
