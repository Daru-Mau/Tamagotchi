class Pet:
    def __init__(self, name: str, age: int, happiness: int, hunger: int):
        self.name = name
        self.age = age
        self.happiness = happiness
        self.hunger = hunger

    def feed(self, food_amount: int):
        self.hunger -= food_amount
        if self.hunger < 0:
            self.hunger = 0

    def play(self, play_time: int):
        self.happiness += play_time
        if self.happiness > 100:
            self.happiness = 100

    def age_pet(self):
        self.age += 1

    def status(self):
        return {
            "name": self.name,
            "age": self.age,
            "happiness": self.happiness,
            "hunger": self.hunger
        }