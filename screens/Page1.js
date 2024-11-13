import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button'; // Adjust the path to your Button component
import Container from '../components/Container';

export default function Page1({ route, navigation }) {
    const { userText } = route.params; // Get the text passed from HomeScreen
  
    return (
        <Container>
            <View style={styles.container}>
            <Text style={styles.text}>Page 1 Screen</Text>
            <Text style={styles.text}>User input: {userText}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    label="Go to Details"
                    theme="primary" // Use the primary theme for styling
                    onPress={() => navigation.navigate('Details')} // Navigate to Details screen
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    label="Go back"
                    theme="primary" // Use the primary theme for styling
                    onPress={() => navigation.goBack()} // Go back to the previous screen
                />
            </View>
            </View>
        </Container>
        
    );
}

// Styles for the Page1 component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222', // Optional: Set a background color
    },
    text: {
        color: 'white', // Set text color to white
        fontSize: 18,
        marginBottom: 10,
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%', // Make buttons wider to match the TextInput width in HomeScreen
        alignItems: 'center', // Center the buttons horizontally
    },
});
