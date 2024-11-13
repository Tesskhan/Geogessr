import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
    const { marker } = route.params; // Access the marker data passed from Page2

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Marker Details</Text>
            <Text style={styles.description}>Description: {marker.description}</Text>
            <Text style={styles.coordinates}>
                Coordinates: {marker.coordinate.latitude}, {marker.coordinate.longitude}
            </Text>
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
    description: {
        fontSize: 18,
        margin: 10,
    },
    coordinates: {
        fontSize: 16,
        margin: 10,
    },
});

export default DetailsScreen;
