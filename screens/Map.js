import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Button from '../components/Button'; // Import the custom Button
import Container from '../components/Container'; // Import the Container
import Title from '../components/Title'; // Import the Container
import Line from '../components/Line';

export default function Map({ navigation }) {
    const [markers, setMarkers] = useState([]); // State to store markers
    const [draggingMarker, setDraggingMarker] = useState(null); // State to track the currently dragging marker

    // Function to handle map press and add a new marker
    const handleMapPress = (event) => {
        const newCoordinate = event.nativeEvent.coordinate;

        // Check if the location already has a marker
        const isDuplicate = markers.some(marker =>
            marker.coordinate.latitude === newCoordinate.latitude &&
            marker.coordinate.longitude === newCoordinate.longitude
        );

        if (isDuplicate) {
            Alert.alert(
                'Duplicate Marker',
                'A marker already exists at this location.',
                [{ text: 'OK' }]
            );
            return; // Exit the function if the location is a duplicate
        }

        // Create a new marker if validation is passed
        const newMarker = {
            coordinate: newCoordinate,
            key: markers.length.toString(), // Unique key for each marker
        };

        setMarkers((prevMarkers) => [...prevMarkers, newMarker]); // Update state with new marker
    };

    // Function to handle the beginning of dragging a marker
    const onMarkerPressIn = (marker) => {
        setDraggingMarker(marker); // Set the marker being dragged
    };

    // Function to handle dragging a marker
    const onMarkerDrag = (event) => {
        if (draggingMarker) {
            const newCoordinate = event.nativeEvent.coordinate;

            // Update the position of the dragging marker
            const updatedMarkers = markers.map(marker => {
                if (marker.key === draggingMarker.key) {
                    return { ...marker, coordinate: newCoordinate };
                }
                return marker;
            });
            setMarkers(updatedMarkers); // Update markers state
        }
    };

    // Function to handle the end of dragging a marker
    const onMarkerPressOut = () => {
        setDraggingMarker(null); // Clear dragging marker
    };

    return (
        <Container>
            <Title>Guessing</Title>
            <Line />
            {/* Container for the Map with Border */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 41.7220, // Latitude for Manresa
                        longitude: 1.8222, // Longitude for Manresa
                        latitudeDelta: 0.0922, // Adjust the zoom level as needed
                        longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress} // Handle map press to add markers
                >
                    {/* Render markers from the markers state */}
                    {markers.map((marker) => (
                        <Marker
                            key={marker.key} // Unique key for each marker
                            coordinate={marker.coordinate} // Coordinate for the marker
                            pinColor="red" // Change the pin color to highlight
                            title="Marker"
                            draggable // Make the marker draggable
                            onPressIn={() => onMarkerPressIn(marker)} // Set marker being dragged
                            onPressOut={onMarkerPressOut} // Clear dragging marker
                            onDrag={onMarkerDrag} // Handle dragging
                        />
                    ))}
                </MapView>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    label="Go back"
                    theme="primary"
                    onPress={() => navigation.goBack()}
                />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 50, // Increase height for a better look
        borderColor: '#ffd33d', // Border color
        borderWidth: 1, // Border width
        width: '80%',
        marginBottom: 20,
        paddingHorizontal: 15, // Add padding for inner text
        paddingVertical: 10, // Add vertical padding for better height
        color: 'white', // Set input text color to white
        borderRadius: 10, // Rounded corners
        backgroundColor: '#333', // Darker background for input
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.5, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    mapContainer: {
        width: '100%', // Set width to 98% to create space from the edges
        height: '50%', // Adjust height of the map
        borderRadius: 20, // Optional: rounded corners for a nicer look
        overflow: 'hidden', // Ensures child components respect the border radius
        borderWidth: 2, // Set border width
        borderColor: '#FFE500', // Set border color
        marginVertical: 20, // Add vertical margin for spacing
    },
    map: {
        width: '100%', // Ensure the map takes the full width of the container
        height: '100%', // Ensure the map takes the full height of the container
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%', // Width to match the input in HomeScreen
        alignItems: 'center', // Center the buttons horizontally
    },
});
