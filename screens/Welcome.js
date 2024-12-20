import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Container from '../components/Container'; // Import the Container
import Title from '../components/Title'; // Import the Container

export default function Welcome({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Map')}>
      <View style={styles.wrapper}>
        <Container>
          <Title>Welcome to Geogessr</Title>
          <View style={styles.container}>
            <Text style={styles.text}>
            This is a location guessing game where you tap the map to guess each place's location. {'\n'}
            Your score is based on how close your guess is to the actual spot—the closer your score is to 0, the better.{'\n'}
            At the end, you'll see your total score and how well you did.
            </Text>
          </View>
          <View>
            <Text style={styles.start}>Press anywhere to start</Text>
          </View>
        </Container>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // Ensure the wrapper takes up the full screen
  },
  text: {
    textAlign: 'justify', // Justify the text for even margins
    fontSize: 14,         // Increase font size for readability
    color: '#B0A854',     // A bright, warm color for the text
    lineHeight: 26,       // Increase line height for better readability
    marginHorizontal: 30,    // Space after text for better separation
    paddingTop: 40,
    paddingBottom: 40,
  },
  start: {
    textAlign: 'center', // Center align the start text
    fontSize: 18,
    color: '#777',        // A neutral color for the "Press anywhere" text
    fontWeight: 'bold',   // Make it bold to catch attention
  },
});
