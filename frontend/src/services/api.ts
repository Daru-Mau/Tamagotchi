import { Pet } from '../store';
import { 
  SupabasePetApi, 
  SupabasePetInteractionApi, 
  CreatePetDto, 
  UpdatePetDto,
  CreatePetInteractionDto
} from './supabase';

// Export types from supabase service
export { CreatePetDto, UpdatePetDto, CreatePetInteractionDto };

// Define the PetInteraction type
export interface PetInteraction {
  id: string;
  petId: string;
  type: string;
  pointsChange: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Define the RecentInteraction type with pet name
export interface RecentInteraction extends PetInteraction {
  petName: string;
}

// Api service methods - now using Supabase
export const PetApi = {
  // Get all pets
  fetchPets: async (): Promise<Pet[]> => {
    return SupabasePetApi.fetchPets();
  },

  // Get a specific pet by ID
  fetchPetById: async (petId: string): Promise<Pet> => {
    return SupabasePetApi.fetchPetById(petId);
  },

  // Create a new pet
  createPet: async (petData: CreatePetDto): Promise<Pet> => {
    return SupabasePetApi.createPet(petData);
  },

  // Update an existing pet
  updatePet: async (petId: string, petData: UpdatePetDto): Promise<Pet> => {
    return SupabasePetApi.updatePet(petId, petData);
  },

  // Delete a pet
  deletePet: async (petId: string): Promise<void> => {
    return SupabasePetApi.deletePet(petId);
  },

  // Feed a pet
  feedPet: async (petId: string, amount: number): Promise<Pet> => {
    return SupabasePetApi.feedPet(petId, amount);
  },

  // Play with a pet
  playWithPet: async (petId: string, time: number): Promise<Pet> => {
    return SupabasePetApi.playWithPet(petId, time);
  },

  // Get all interactions for a pet
  fetchPetInteractions: async (petId: string): Promise<PetInteraction[]> => {
    return SupabasePetInteractionApi.fetchPetInteractions(petId);
  },

  // Create a new interaction for a pet
  createPetInteraction: async (interactionData: CreatePetInteractionDto): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createPetInteraction(interactionData);
  },

  // Get recent interactions for all pets
  fetchRecentInteractions: async (): Promise<RecentInteraction[]> => {
    return SupabasePetInteractionApi.fetchRecentInteractions();
  }
};