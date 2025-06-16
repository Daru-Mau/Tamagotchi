import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchPets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};

export const createPet = async (petData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/pets`, petData);
        return response.data;
    } catch (error) {
        console.error('Error creating pet:', error);
        throw error;
    }
};

export const updatePet = async (petId, petData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/pets/${petId}`, petData);
        return response.data;
    } catch (error) {
        console.error('Error updating pet:', error);
        throw error;
    }
};

export const deletePet = async (petId) => {
    try {
        await axios.delete(`${API_BASE_URL}/pets/${petId}`);
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
};