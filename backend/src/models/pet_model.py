import uuid
from datetime import datetime


class Pet:
    def __init__(self, name: str, pet_type: str, age: int = 0, happiness: int = 100, hunger: int = 0):
        self.id = str(uuid.uuid4())
        self.name = name
        self.pet_type = pet_type
        self.age = age
        self.happiness = happiness
        self.hunger = hunger
        self.created_at = datetime.now()
        self.last_interaction = datetime.now()

    def feed(self, food_amount: int):
        self.hunger -= food_amount
        if self.hunger < 0:
            self.hunger = 0
        self.last_interaction = datetime.now()
        return self

    def play(self, play_time: int):
        self.happiness += play_time
        self.hunger += play_time // 2  # Playing makes the pet hungry
        if self.happiness > 100:
            self.happiness = 100
        if self.hunger > 100:
            self.hunger = 100
        self.last_interaction = datetime.now()
        return self

    def age_pet(self):
        self.age += 1
        return self

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "pet_type": self.pet_type,
            "age": self.age,
            "happiness": self.happiness,
            "hunger": self.hunger,
            "created_at": self.created_at.isoformat(),
            "last_interaction": self.last_interaction.isoformat()
        }
