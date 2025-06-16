import { Pet } from '../store';
import { SupabasePetApi, CreatePetDto, UpdatePetDto } from './supabase';

// Export types from supabase service
export { CreatePetDto, UpdatePetDto };

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
  }
};