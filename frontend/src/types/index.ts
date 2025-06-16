export type Pet = {
  id: string;
  name: string;
  petType: string;
  age: number;
  happiness: number;
  hunger: number;
  createdAt: string;
  lastInteraction: string;
};

export type PetState = {
  pets: Pet[];
  activePetId: string | null;
  loading: boolean;
  error: string | null;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface CreatePetDto {
  name: string;
  pet_type: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}

export interface UpdatePetDto {
  name?: string;
  pet_type?: string;
  age?: number;
  happiness?: number;
  hunger?: number;
}