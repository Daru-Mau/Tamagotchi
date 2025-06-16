import { 
  SupabasePetInteractionApi, 
  CreatePetInteractionDto 
} from './supabase';

// Export types from supabase service
export type { CreatePetInteractionDto };

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

// Api service methods for pet interactions
export const PetInteractionApi = {
  // Get all interactions for a pet
  fetchPetInteractions: async (petId: string): Promise<PetInteraction[]> => {
    return SupabasePetInteractionApi.fetchPetInteractions(petId);
  },

  // Create a new interaction for a pet
  createInteraction: async (interactionData: CreatePetInteractionDto): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createInteraction(interactionData);
  },

  // Get recent interactions for all pets
  fetchRecentInteractions: async (limit = 10): Promise<RecentInteraction[]> => {
    return SupabasePetInteractionApi.fetchRecentInteractions(limit);
  },

  // Helper methods for common interactions
  feedPet: async (petId: string, amount = 10): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createInteraction({
      pet_id: petId,
      interaction_type: 'feed',
      points_change: amount
    });
  },

  playWithPet: async (petId: string, amount = 15): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createInteraction({
      pet_id: petId,
      interaction_type: 'play',
      points_change: amount
    });
  },

  cleanPet: async (petId: string): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createInteraction({
      pet_id: petId,
      interaction_type: 'clean',
      points_change: 5
    });
  },

  sleepPet: async (petId: string): Promise<PetInteraction> => {
    return SupabasePetInteractionApi.createInteraction({
      pet_id: petId,
      interaction_type: 'sleep',
      points_change: 8
    });
  }
};
