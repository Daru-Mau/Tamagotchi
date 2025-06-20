import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

// Using environment variables from config/env.ts
// To set up your Supabase project:
// 1. Create a project at https://supabase.com/dashboard
// 2. Update the values in src/config/env.ts with your credentials

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Create a type for the pet table in Supabase
export type SupabasePet = {
  id: string;
  name: string;
  pet_type: string;
  age: number;
  happiness: number;
  hunger: number;
  created_at: string;
  last_interaction: string;
  user_id: string;
};

// Create a type for the pet interaction in Supabase
export type SupabasePetInteraction = {
  id: string;
  pet_id: string;
  interaction_type: 'feed' | 'play' | 'clean' | 'sleep' | string;
  points_change: number;
  created_at: string;
  metadata?: Record<string, any>;
};

// Create a type for creating a new pet interaction
export interface CreatePetInteractionDto {
  pet_id: string;
  interaction_type: 'feed' | 'play' | 'clean' | 'sleep' | string;
  points_change: number;
  metadata?: Record<string, any>;
}

// Create a type for the pet creation
export interface CreatePetDto {
  name: string;
  pet_type: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}

// Create a type for the pet update
export interface UpdatePetDto {
  name?: string;
  pet_type?: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}

// Convert Supabase pet to frontend Pet
const mapSupabasePetToPet = (supabasePet: SupabasePet) => {
  return {
    id: supabasePet.id,
    name: supabasePet.name,
    petType: supabasePet.pet_type,
    age: supabasePet.age,
    happiness: supabasePet.happiness,
    hunger: supabasePet.hunger,
    createdAt: supabasePet.created_at,
    lastInteraction: supabasePet.last_interaction,
  };
};

// Supabase API methods for pets
export const SupabasePetApi = {
  // Get all pets for the current user
  fetchPets: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map(mapSupabasePetToPet);
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Get a single pet by ID
  fetchPetById: async (petId: string) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetToPet(data);
    } catch (error) {
      console.error(`Error fetching pet ${petId}:`, error);
      throw error;
    }
  },

  // Create a new pet
  createPet: async (petData: CreatePetDto) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const newPet = {
        ...petData,
        user_id: user.id,
        happiness: petData.happiness || 100,
        hunger: petData.hunger || 0,
        age: petData.age || 0,
      };
      
      const { data, error } = await supabase
        .from('pets')
        .insert(newPet)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetToPet(data);
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  },

  // Update an existing pet
  updatePet: async (petId: string, petData: UpdatePetDto) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(petData)
        .eq('id', petId)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetToPet(data);
    } catch (error) {
      console.error(`Error updating pet ${petId}:`, error);
      throw error;
    }
  },

  // Delete a pet
  deletePet: async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting pet ${petId}:`, error);
      throw error;
    }
  },

  // Feed a pet
  feedPet: async (petId: string, amount: number) => {
    try {
      // Get current pet state
      const { data: pet, error: fetchError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new hunger level (ensuring it stays between 0-100)
      const newHunger = Math.max(0, pet.hunger - amount);
      
      // Update pet with new hunger value and last interaction time
      const { data, error } = await supabase
        .from('pets')
        .update({ 
          hunger: newHunger,
          last_interaction: new Date().toISOString()
        })
        .eq('id', petId)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetToPet(data);
    } catch (error) {
      console.error(`Error feeding pet ${petId}:`, error);
      throw error;
    }
  },

  // Play with a pet
  playWithPet: async (petId: string, time: number) => {
    try {
      // Get current pet state
      const { data: pet, error: fetchError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new happiness level (ensuring it stays between 0-100)
      const newHappiness = Math.min(100, pet.happiness + time);
      
      // Update pet with new happiness value and last interaction time
      const { data, error } = await supabase
        .from('pets')
        .update({ 
          happiness: newHappiness,
          last_interaction: new Date().toISOString()
        })
        .eq('id', petId)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetToPet(data);
    } catch (error) {
      console.error(`Error playing with pet ${petId}:`, error);
      throw error;
    }
  },
};

// Convert Supabase pet interaction to frontend PetInteraction
const mapSupabasePetInteractionToPetInteraction = (interaction: SupabasePetInteraction) => {
  return {
    id: interaction.id,
    petId: interaction.pet_id,
    type: interaction.interaction_type,
    pointsChange: interaction.points_change,
    createdAt: interaction.created_at,
    metadata: interaction.metadata || {},
  };
};

// Supabase API methods for pet interactions
export const SupabasePetInteractionApi = {
  // Create a new interaction for a pet
  createInteraction: async (interactionData: CreatePetInteractionDto) => {
    try {
      const { data, error } = await supabase
        .from('pet_interactions')
        .insert([{
          pet_id: interactionData.pet_id,
          interaction_type: interactionData.interaction_type,
          points_change: interactionData.points_change,
          metadata: interactionData.metadata || {},
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return mapSupabasePetInteractionToPetInteraction(data);
    } catch (error) {
      console.error('Error creating pet interaction:', error);
      throw error;
    }
  },

  // Get all interactions for a specific pet
  fetchPetInteractions: async (petId: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_interactions')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(mapSupabasePetInteractionToPetInteraction);
    } catch (error) {
      console.error('Error fetching pet interactions:', error);
      throw error;
    }
  },

  // Get recent interactions across all user's pets
  fetchRecentInteractions: async (limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('recent_pet_interactions')
        .select('*')
        .eq('user_id', user.id)
        .limit(limit);
      
      if (error) throw error;
      
      return data.map(interaction => ({
        id: interaction.interaction_id,
        petId: interaction.pet_id,
        petName: interaction.pet_name,
        type: interaction.interaction_type,
        pointsChange: interaction.points_change,
        createdAt: interaction.created_at,
        metadata: interaction.metadata || {},
      }));
    } catch (error) {
      console.error('Error fetching recent interactions:', error);
      throw error;
    }
  }
};

// Authentication API
export const AuthApi = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
};
