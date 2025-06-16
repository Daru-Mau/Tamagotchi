import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Pet = () => {
    const [happiness, setHappiness] = useState(100);
    const [hunger, setHunger] = useState(0);

    const feedPet = () => {
        setHappiness(happiness + 10);
        setHunger(hunger - 10);
    };

    const playWithPet = () => {
        setHappiness(happiness + 20);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tamagotchi Pet</Text>
            <Text>Happiness: {happiness}</Text>
            <Text>Hunger: {hunger}</Text>
            <Button title="Feed" onPress={feedPet} />
            <Button title="Play" onPress={playWithPet} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Pet;