import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateTournamentScreen = () => {
    const [tournamentName, setTournamentName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Tournament Created:', { tournamentName, date, location });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Tournament</Text>
            <TextInput
                style={styles.input}
                placeholder="Tournament Name"
                value={tournamentName}
                onChangeText={setTournamentName}
            />
            <TextInput
                style={styles.input}
                placeholder="Date"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <Button title="Create Tournament" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default CreateTournamentScreen;