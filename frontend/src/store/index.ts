import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Pet interface
export interface Pet {
  id: string;
  name: string;
  petType: string;
  age: number;
  happiness: number;
  hunger: number;
  createdAt: string;
  lastInteraction: string;
}

// State interface
interface PetState {
  pets: Pet[];
  activePetId: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PetState = {
  pets: [],
  activePetId: null,
  loading: false,
  error: null,
};

// Pet slice
const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setPets(state, action: PayloadAction<Pet[]>) {
      state.pets = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPet(state, action: PayloadAction<Pet>) {
      state.pets.push(action.payload);
    },
    updatePet(state, action: PayloadAction<Pet>) {
      const index = state.pets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
    },
    removePet(state, action: PayloadAction<string>) {
      state.pets = state.pets.filter(pet => pet.id !== action.payload);
    },
    setActivePet(state, action: PayloadAction<string>) {
      state.activePetId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// Export actions
export const { 
  setPets, 
  addPet, 
  updatePet, 
  removePet, 
  setActivePet, 
  setLoading, 
  setError 
} = petSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    pets: petSlice.reducer,
  }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;