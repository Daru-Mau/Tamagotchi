import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Card,
  Title,
  Paragraph,
  FAB,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  Pet,
  setPets,
  addPet,
  setLoading,
  setError,
  setActivePet,
} from "../store";
import { PetApi } from "../services/api";
import { StackNavigationProp } from "@react-navigation/stack";

type HomeScreenProps = {
  navigation: StackNavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector(
    (state: RootState) => state.pets
  );

  // Local state for the create pet dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("");

  // Load pets on component mount
  useEffect(() => {
    const loadPets = async () => {
      try {
        dispatch(setLoading(true));
        const fetchedPets = await PetApi.fetchPets();
        dispatch(setPets(fetchedPets));
      } catch (error) {
        dispatch(setError("Failed to load pets"));
        console.error("Failed to load pets:", error);
      }
    };

    loadPets();
  }, [dispatch]);

  // Create a new pet
  const handleCreatePet = async () => {
    if (!newPetName.trim() || !newPetType.trim()) {
      return;
    }

    try {
      const newPet = await PetApi.createPet({
        name: newPetName,
        pet_type: newPetType,
      });

      dispatch(addPet(newPet));
      setDialogVisible(false);
      setNewPetName("");
      setNewPetType("");
    } catch (error) {
      dispatch(setError("Failed to create pet"));
      console.error("Failed to create pet:", error);
    }
  };

  // Select a pet and navigate to the game screen
  const handleSelectPet = (pet: Pet) => {
    dispatch(setActivePet(pet.id));
    navigation.navigate("Game", { petId: pet.id });
  };

  // Render a pet item
  const renderPetItem = ({ item }: { item: Pet }) => (
    <Card style={styles.petCard} onPress={() => handleSelectPet(item)}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Type: {item.petType}</Paragraph>
        <Paragraph>Age: {item.age}</Paragraph>
        <View style={styles.statusContainer}>
          <View style={styles.statusBar}>
            <View
              style={[
                styles.statusFill,
                { width: `${item.happiness}%`, backgroundColor: "#4CAF50" },
              ]}
            />
            <Text style={styles.statusLabel}>Happiness: {item.happiness}%</Text>
          </View>
          <View style={styles.statusBar}>
            <View
              style={[
                styles.statusFill,
                { width: `${item.hunger}%`, backgroundColor: "#FF9800" },
              ]}
            />
            <Text style={styles.statusLabel}>Hunger: {item.hunger}%</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Your Virtual Pets</Title>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={() => dispatch(setError(""))}>
            Dismiss
          </Button>
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any pets yet!</Text>
          <Text style={styles.emptySubtext}>
            Create a new pet to get started.
          </Text>
          <Button
            mode="contained"
            onPress={() => setDialogVisible(true)}
            style={styles.createButton}
          >
            Create Your First Pet
          </Button>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
        visible={!loading && pets.length > 0}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Create a New Pet</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Pet Name"
              value={newPetName}
              onChangeText={setNewPetName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Pet Type (e.g., Cat, Dog, Dinosaur)"
              value={newPetType}
              onChangeText={setNewPetType}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreatePet}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 80,
  },
  petCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBar: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginVertical: 4,
    overflow: "hidden",
    position: "relative",
  },
  statusFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  statusLabel: {
    position: "absolute",
    left: 8,
    top: 2,
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#6200ee",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  createButton: {
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginVertical: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 16,
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default HomeScreen;
