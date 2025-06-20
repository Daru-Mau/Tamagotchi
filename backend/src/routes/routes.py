from flask import Blueprint, jsonify, request
from controllers.pet_controller import PetController
from routes.auth import token_required

# Create a Blueprint for our API routes
api_routes = Blueprint('api', __name__)

# Public routes - no authentication required


@api_routes.route('/pets', methods=['GET'])
def get_pets():
    """Get all pets"""
    return jsonify(PetController.get_all_pets())


@api_routes.route('/pets/<pet_id>', methods=['GET'])
def get_pet(pet_id):
    """Get a pet by ID"""
    return jsonify(PetController.get_pet_by_id(pet_id))

# Protected routes - require authentication


@api_routes.route('/pets', methods=['POST'])
@token_required
def create_pet(user_id):
    """Create a new pet"""
    data = request.json
    # Add the user_id to the pet data
    data['user_id'] = user_id
    return jsonify(PetController.create_pet(data)), 201


@api_routes.route('/pets/<pet_id>', methods=['PUT'])
@token_required
def update_pet(user_id, pet_id):
    """Update an existing pet"""
    data = request.json
    return jsonify(PetController.update_pet(pet_id, data, user_id))


@api_routes.route('/pets/<pet_id>', methods=['DELETE'])
@token_required
def delete_pet(user_id, pet_id):
    """Delete a pet"""
    return jsonify(PetController.delete_pet(pet_id, user_id))


@api_routes.route('/pets/<pet_id>/feed', methods=['POST'])
@token_required
def feed_pet(user_id, pet_id):
    """Feed a pet to decrease hunger"""
    data = request.json
    amount = data.get('amount', 10)
    return jsonify(PetController.feed_pet(pet_id, amount, user_id))


@api_routes.route('/pets/<pet_id>/play', methods=['POST'])
@token_required
def play_with_pet(user_id, pet_id):
    """Play with a pet to increase happiness"""
    data = request.json
    time = data.get('time', 10)
    return jsonify(PetController.play_with_pet(pet_id, time, user_id))

# User-specific routes


@api_routes.route('/user/pets', methods=['GET'])
@token_required
def get_user_pets(user_id):
    """Get all pets belonging to the authenticated user"""
    return jsonify(PetController.get_pets_by_user(user_id))

# Health check endpoint


@api_routes.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Tamagotchi API is running!"})
