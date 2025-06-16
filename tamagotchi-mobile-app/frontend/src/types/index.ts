export type Pet = {
  id: string;
  name: string;
  age: number;
  happiness: number;
  hunger: number;
  health: number;
};

export type GameState = {
  pets: Pet[];
  currentPetId: string | null;
  isGameActive: boolean;
};

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}