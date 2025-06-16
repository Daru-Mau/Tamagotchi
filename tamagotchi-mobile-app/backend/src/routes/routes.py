from flask import Flask, jsonify, request
from backend.src.controllers.pet_controller import PetController

app = Flask(__name__)

@app.route('/api/pets', methods=['GET'])
def get_pets():
    return jsonify(PetController.get_all_pets())

@app.route('/api/pets/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    return jsonify(PetController.get_pet_by_id(pet_id))

@app.route('/api/pets', methods=['POST'])
def create_pet():
    data = request.json
    return jsonify(PetController.create_pet(data)), 201

@app.route('/api/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    data = request.json
    return jsonify(PetController.update_pet(pet_id, data))

@app.route('/api/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    return jsonify(PetController.delete_pet(pet_id))

if __name__ == '__main__':
    app.run(debug=True)