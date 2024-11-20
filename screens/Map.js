import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Button from '../components/Button';
import Container from '../components/Container';
import Title from '../components/Title';
import Line from '../components/Line';
import { WebView } from 'react-native-webview';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../FireBase';

export default function Map({ navigation }) {
    const questions = [
        { id: "aPuXkdF1LGPtyN4VjLFj" },
        { id: "TRPvmRT95hRboID2Dwss" },
        { id: "XqcPhCSUvJRmx8rTkwGt" },
        { id: "1VvaHI537pCVdABAmYYf" },
        { id: "iC7SS7WYi30QY2XsHNMU" },
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [markers, setMarkers] = useState([]);
    const [showStreetView, setShowStreetView] = useState(false);
    const [streetViewUrl, setStreetViewUrl] = useState('');
    const [referenceLocation, setReferenceLocation] = useState(null);
    const [question, setQuestion] = useState(''); // Store the question
    const [guessMade, setGuessMade] = useState(false);

    // Fetch the GeoPoint and question from Firestore
    const fetchReferenceLocation = async () => {
        if (currentQuestionIndex >= questions.length) {
            Alert.alert("No more questions", "You've completed all questions.", [{ text: "OK" }]);
            return;
        }

        const db = getFirestore(app);
        const docRef = doc(db, "Locations", questions[currentQuestionIndex].id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const geoPoint = docSnap.data().location;
            setReferenceLocation({
                latitude: geoPoint.latitude,
                longitude: geoPoint.longitude,
            });

            const fetchedQuestion = docSnap.data().question; // Fetch question
            setQuestion(fetchedQuestion); // Set the question
        } else {
            console.error("No such document!");
        }
    };

    // Fetch the reference location and question on mount and when the question changes
    useEffect(() => {
        fetchReferenceLocation();
    }, [currentQuestionIndex]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    const handleMapPress = (event) => {
        if (guessMade) return; // Prevent multiple taps

        const newCoordinate = event.nativeEvent.coordinate;

        if (!referenceLocation) {
            Alert.alert(
                "Reference Location Not Loaded",
                "The reference location is still loading. Please try again.",
                [{ text: "OK" }]
            );
            return;
        }

        const newMarker = {
            coordinate: newCoordinate,
            key: "userGuess",
        };

        const distance = calculateDistance(
            referenceLocation.latitude,
            referenceLocation.longitude,
            newCoordinate.latitude,
            newCoordinate.longitude
        );

        Alert.alert(
            'Distance',
            `Your guess is ${distance.toFixed(2)} km away from the reference location.`,
            [{ text: 'OK' }]
        );

        setMarkers([newMarker]); // Add user's guess marker
        setGuessMade(true); // Disable further taps
    };

    const handleMarkerPress = (coordinate) => {
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coordinate.latitude},${coordinate.longitude}`;
        setStreetViewUrl(streetViewUrl);
        setShowStreetView(true);
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Advance to the next question
            setMarkers([]);
            setGuessMade(false);
            setShowStreetView(false);
        } else {
            Alert.alert("Game Over", "You've completed all questions.", [{ text: "OK" }]);
        }
    };

    return (
        <Container>
            <Title>Guessing</Title>
            <Line />

            {/* Display the question as white text over the map */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{question}</Text>
            </View>

            {showStreetView ? (
                <WebView
                    source={{ uri: streetViewUrl }}
                    style={{ width: '100%', height: '100%' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            ) : (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: referenceLocation ? referenceLocation.latitude : 41.7220,
                            longitude: referenceLocation ? referenceLocation.longitude : 1.8222,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        mapType="satellite"
                        onPress={handleMapPress}
                    >
                        {/* User Guess Marker */}
                        {markers.map((marker) => (
                            <Marker
                                key={marker.key}
                                coordinate={marker.coordinate}
                                pinColor="red"
                                title="Your Guess"
                                onPress={() => handleMarkerPress(marker.coordinate)}
                            />
                        ))}

                        {/* Reference Location Marker */}
                        {referenceLocation && guessMade && (
                            <Marker
                                coordinate={referenceLocation}
                                pinColor="blue"
                                title="Reference Location"
                            />
                        )}

                        {/* Line between User Guess and Reference */}
                        {referenceLocation && markers.length > 0 && (
                            <Polyline
                                coordinates={[
                                    referenceLocation,
                                    markers[0].coordinate,
                                ]}
                                strokeColor="purple"
                                strokeWidth={3}
                            />
                        )}
                    </MapView>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    label="Continue"
                    theme="primary"
                    onPress={handleContinue}
                />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: '50%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFE500',
        marginVertical: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    questionContainer: {
        padding: 10,
        alignItems: 'center',
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white', // White text for visibility over the map
        textAlign: 'center',
    },
});
