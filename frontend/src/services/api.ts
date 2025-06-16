import axios from 'axios';
import { Pet } from '../store';

// Use localhost for development, but should be updated for production
const API_BASE_URL = 'http://localhost:5000/api';

// Type for creating a new pet
interface CreatePetDto {
  name: string;
  pet_type: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}

// Type for updating a pet
interface UpdatePetDto {
  name?: string;
  pet_type?: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}

// Configure axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Api service methods
export const PetApi = {
  // Get all pets
  fetchPets: async (): Promise<Pet[]> => {
    try {
      const response = await api.get('/pets');
      return response.data;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Get a specific pet by ID
  fetchPetById: async (petId: string): Promise<Pet> => {
    try {
      const response = await api.get(`/pets/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pet ${petId}:`, error);
      throw error;
    }
  },

  // Create a new pet
  createPet: async (petData: CreatePetDto): Promise<Pet> => {
    try {
      const response = await api.post('/pets', petData);
      return response.data;
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  },

  // Update an existing pet
  updatePet: async (petId: string, petData: UpdatePetDto): Promise<Pet> => {
    try {
      const response = await api.put(`/pets/${petId}`, petData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pet ${petId}:`, error);
      throw error;
    }
  },

  // Delete a pet
  deletePet: async (petId: string): Promise<void> => {
    try {
      await api.delete(`/pets/${petId}`);
    } catch (error) {
      console.error(`Error deleting pet ${petId}:`, error);
      throw error;
    }
  },

  // Feed a pet
  feedPet: async (petId: string, amount: number): Promise<Pet> => {
    try {
      const response = await api.post(`/pets/${petId}/feed`, { amount });
      return response.data;
    } catch (error) {
      console.error(`Error feeding pet ${petId}:`, error);
      throw error;
    }
  },

  // Play with a pet
  playWithPet: async (petId: string, time: number): Promise<Pet> => {
    try {
      const response = await api.post(`/pets/${petId}/play`, { time });
      return response.data;
    } catch (error) {
      console.error(`Error playing with pet ${petId}:`, error);
      throw error;
    }
  }
};