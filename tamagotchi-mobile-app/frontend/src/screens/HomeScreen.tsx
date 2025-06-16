import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen: React.FC = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to Tamagotchi Game!</Text>
            <Button
                title="Start Game"
                onPress={() => navigation.navigate('GameScreen')}
            />
        </View>
    );
};

export default HomeScreen;