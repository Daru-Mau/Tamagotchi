from flask import jsonify, request
from ..models.pet_model import Pet

pets = []

def create_pet():
    data = request.get_json()
    new_pet = Pet(data['name'], data['type'], data['age'])
    pets.append(new_pet)
    return jsonify(new_pet.to_dict()), 201

def get_pets():
    return jsonify([pet.to_dict() for pet in pets]), 200

def get_pet(pet_id):
    pet = next((pet for pet in pets if pet.id == pet_id), None)
    if pet is not None:
        return jsonify(pet.to_dict()), 200
    return jsonify({'error': 'Pet not found'}), 404

def update_pet(pet_id):
    data = request.get_json()
    pet = next((pet for pet in pets if pet.id == pet_id), None)
    if pet is not None:
        pet.name = data.get('name', pet.name)
        pet.type = data.get('type', pet.type)
        pet.age = data.get('age', pet.age)
        return jsonify(pet.to_dict()), 200
    return jsonify({'error': 'Pet not found'}), 404

def delete_pet(pet_id):
    global pets
    pets = [pet for pet in pets if pet.id != pet_id]
    return jsonify({'message': 'Pet deleted'}), 204