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
    const [question, setQuestion] = useState('');
    const [guessMade, setGuessMade] = useState(false);
    const [totalScore, setTotalScore] = useState(0); // Cumulative score
    const [currentGuessScore, setCurrentGuessScore] = useState(0); // Current guess score
    const [questionsData, setQuestionsData] = useState([]);

    // For animated score display
    const [displayScore, setDisplayScore] = useState(0);
    const [displayTotalScore, setDisplayTotalScore] = useState(0);

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

            const fetchedQuestion = docSnap.data().question;
            setQuestion(fetchedQuestion);
        } else {
            console.error("No such document!");
        }
    };

    useEffect(() => {
        fetchReferenceLocation();
    }, [currentQuestionIndex]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;

        const R = 6371000; // Radius of the Earth in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    };

    const handleMapPress = (event) => {
        if (guessMade) return; // Prevent multiple taps after the guess is made

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

        // Calculate the distance for the current guess
        const dist = calculateDistance(
            referenceLocation.latitude,
            referenceLocation.longitude,
            newCoordinate.latitude,
            newCoordinate.longitude
        );

        setMarkers([newMarker]); // Add user's guess marker
        setCurrentGuessScore(dist); // Store the score for the current guess
    };

    const handleMarkerPress = (coordinate) => {
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coordinate.latitude},${coordinate.longitude}`;
        setStreetViewUrl(streetViewUrl);
        setShowStreetView(true);
    };

    const handleCheck = () => {
        if (!markers.length) return;

        setGuessMade(true); // Disable further repositioning

        // Add the current guess score to the total score
        const updatedTotalScore = totalScore + currentGuessScore;
        setTotalScore(updatedTotalScore); // Accumulate the total score

        // Store the question data
        const updatedQuestionsData = [
            ...questionsData,
            {
                question: question, // The current question
                score: currentGuessScore, // The score for this guess (distance)
            }
        ];
        setQuestionsData(updatedQuestionsData); // Update the data

        // Animate the score display
        animateScore(currentGuessScore, setDisplayScore);
        animateScore(updatedTotalScore, setDisplayTotalScore);
    };

    const animateScore = (targetValue, setter) => {
        let startValue = 0;
        const duration = 1000; // Animation duration in milliseconds
        const increment = Math.ceil(targetValue / (duration / 50)); // Increment per frame

        const interval = setInterval(() => {
            startValue += increment;
            if (startValue >= targetValue) {
                clearInterval(interval);
                setter(targetValue); // Ensure the final value is set accurately
            } else {
                setter(startValue);
            }
        }, 50);
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setMarkers([]);  // Reset markers
            setGuessMade(false);  // Reset guess flag
            setCurrentGuessScore(0); // Reset current guess score
            setDisplayScore(0); // Reset animated current score
            setShowStreetView(false);  // Hide street view
        } else {
            // Once all questions are completed, navigate to the ResultScreen
            navigation.navigate('ResultScreen', {
                score: totalScore,  // Passing the total score
                questionsData: questionsData  // Passing all question data
            });
        }
    };

    return (
        <Container>
            <Title>Guessing</Title>

            <View style={styles.questionNumberContainer}>
                <Text style={styles.questionNumberText}>
                    Question: {currentQuestionIndex + 1}/{questions.length}
                </Text>
            </View>

            <Line />

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
                        {markers.map((marker) => (
                            <Marker
                                key={marker.key}
                                coordinate={marker.coordinate}
                                pinColor="red"
                                title="Your Guess"
                                onPress={() => handleMarkerPress(marker.coordinate)}
                            />
                        ))}

                        {referenceLocation && markers.length > 0 && guessMade && (
                            <Marker
                                coordinate={referenceLocation}
                                pinColor="blue"
                                title="Reference Location"
                            />
                        )}

                        {referenceLocation && markers.length > 0 && guessMade && (
                            <Polyline
                                coordinates={[referenceLocation, markers[0].coordinate]}
                                strokeColor="purple"
                                strokeWidth={3}
                            />
                        )}
                    </MapView>
                </View>
            )}

            <View style={styles.infoContainer}>
                {/* Show the current score (current guess distance) after the Check button is pressed */}
                {guessMade && markers.length > 0 && (
                    <Text style={styles.infoText}>
                        Score: {displayScore.toFixed(0)} meters
                    </Text>
                )}

                {/* Show the total accumulated score */}
                {guessMade && (
                    <Text style={styles.infoText}>
                        Total Score: {displayTotalScore.toFixed(0)} meters
                    </Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    label={guessMade ? "Continue" : "Check"}
                    theme="primary"
                    onPress={guessMade ? handleContinue : handleCheck}
                    disabled={!markers.length}
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
        color: 'white',
        textAlign: 'center',
    },
    questionNumberContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    questionNumberText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    infoContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
