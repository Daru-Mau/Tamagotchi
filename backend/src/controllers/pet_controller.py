from models.pet_model import Pet

# In-memory storage for pets (in a real app, use a database)
# Structure: { pet_id: Pet }
pets = {}

# User to pet mapping for access control
# Structure: { user_id: [pet_id1, pet_id2, ...] }
user_pets = {}


class PetController:
    @staticmethod
    def get_all_pets():
        """Get all pets"""
        return [pet.to_dict() for pet in pets.values()]

    @staticmethod
    def get_pets_by_user(user_id):
        """Get all pets for a specific user"""
        if user_id not in user_pets:
            return []

        user_pet_ids = user_pets[user_id]
        return [pets[pet_id].to_dict() for pet_id in user_pet_ids if pet_id in pets]

    @staticmethod
    def get_pet_by_id(pet_id):
        """Get a pet by ID"""
        if pet_id not in pets:
            return {"error": "Pet not found"}, 404
        return pets[pet_id].to_dict()

    @staticmethod
    def create_pet(data):
        """Create a new pet"""
        new_pet = Pet(
            name=data["name"],
            pet_type=data["pet_type"],
            age=data.get("age", 0),
            happiness=data.get("happiness", 100),
            hunger=data.get("hunger", 0)
        )

        # Add pet to storage
        pets[new_pet.id] = new_pet

        # If user_id is provided, associate pet with user
        if "user_id" in data:
            user_id = data["user_id"]
            if user_id not in user_pets:
                user_pets[user_id] = []
            user_pets[user_id].append(new_pet.id)

        return new_pet.to_dict()

    @staticmethod
    def update_pet(pet_id, data, user_id=None):
        """Update an existing pet"""
        # Check if pet exists
        if pet_id not in pets:
            return {"error": "Pet not found"}, 404

        # Check if user has access to this pet
        if user_id and (user_id not in user_pets or pet_id not in user_pets[user_id]):
            return {"error": "Unauthorized access"}, 403

        pet = pets[pet_id]

        # Update pet attributes
        if "name" in data:
            pet.name = data["name"]
        if "pet_type" in data:
            pet.pet_type = data["pet_type"]
        if "age" in data:
            pet.age = data["age"]
        if "happiness" in data:
            pet.happiness = data["happiness"]
        if "hunger" in data:
            pet.hunger = data["hunger"]

        return pet.to_dict()

    @staticmethod
    def delete_pet(pet_id, user_id=None):
        """Delete a pet"""
        # Check if pet exists
        if pet_id not in pets:
            return {"error": "Pet not found"}, 404

        # Check if user has access to this pet
        if user_id and (user_id not in user_pets or pet_id not in user_pets[user_id]):
            return {"error": "Unauthorized access"}, 403

        # Remove from pets dictionary
        deleted_pet = pets.pop(pet_id)

        # Remove from user_pets mapping if applicable
        if user_id in user_pets and pet_id in user_pets[user_id]:
            user_pets[user_id].remove(pet_id)

        return {"message": f"Pet {deleted_pet.name} deleted successfully"}

    @staticmethod
    def feed_pet(pet_id, amount, user_id=None):
        """Feed a pet to reduce hunger"""
        # Check if pet exists
        if pet_id not in pets:
            return {"error": "Pet not found"}, 404

        # Check if user has access to this pet
        if user_id and (user_id not in user_pets or pet_id not in user_pets[user_id]):
            return {"error": "Unauthorized access"}, 403

        pet = pets[pet_id]
        pet.feed(amount)
        return pet.to_dict()

    @staticmethod
    def play_with_pet(pet_id, time, user_id=None):
        """Play with a pet to increase happiness"""
        # Check if pet exists
        if pet_id not in pets:
            return {"error": "Pet not found"}, 404

        # Check if user has access to this pet
        if user_id and (user_id not in user_pets or pet_id not in user_pets[user_id]):
            return {"error": "Unauthorized access"}, 403

        pet = pets[pet_id]
        pet.play(time)
        return pet.to_dict()
