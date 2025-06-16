import React from 'react';
import { View, Text, Button } from 'react-native';

const GameScreen: React.FC = () => {
    const handleFeedPet = () => {
        // Logic to feed the pet
    };

    const handlePlayWithPet = () => {
        // Logic to play with the pet
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to the Tamagotchi Game!</Text>
            <Button title="Feed Pet" onPress={handleFeedPet} />
            <Button title="Play with Pet" onPress={handlePlayWithPet} />
        </View>
    );
};

export default GameScreen;