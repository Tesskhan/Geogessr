import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import Title from '../components/Title'; // Assuming you have a Title component
import Container from '../components/Container'; // Reusing the Container component
import Line from '../components/Line';
import Button from '../components/Button'; // Replacing TouchableOpacity with Button

export default function ResultScreen({ route, navigation }) {
    const { score = 0 } = route.params || {}; // Default values

    const scale = new Animated.Value(0);

    React.useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Container style={styles.container}>
            {/* Title positioned at the top */}
            <Title style={styles.title}>Results</Title>
            <Line />

            {/* Animated Score Display */}
            <Animated.View style={[styles.scoreContainer, { transform: [{ scale }] }]}>
                <Text style={styles.scoreText}>Total Score: {Math.floor(score)} meters</Text>
            </Animated.View>

            {/* Play Again Button */}
            <Button
                label="Play Again"
                theme="primary"
                onPress={() => navigation.navigate('Welcome')}
            />
        </Container>
    );
}

// Styles for the ResultScreen component
const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center', // Center items horizontally
        paddingTop: 40, // Add padding at the top for spacing
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFB800',
        marginBottom: 20,
    },
    scoreContainer: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff', // Assuming your Container has a dark background
        margin: 30,
        textAlign: 'center',
    },
});
