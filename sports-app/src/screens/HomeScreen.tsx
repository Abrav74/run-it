import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TournamentList from '../components/TournamentList';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to the Sports App</Text>
            <Text style={{ marginVertical: 20 }}>Here are the upcoming tournaments:</Text>
            <TournamentList />
            <Button
                title="Create Tournament"
                onPress={() => navigation.navigate('CreateTournament')}
            />
            <Button
                title="Profile"
                onPress={() => navigation.navigate('Profile')}
            />
        </View>
    );
};

export default HomeScreen;