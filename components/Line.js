import React from 'react';
import { View, StyleSheet } from 'react-native';

const Line = () => {
    return <View style={styles.line}></View>;
};

const styles = StyleSheet.create({
    line: {
        height: 4,                 // Thin line
        backgroundColor: '#FFE500', // Color of the line (matches your text color in the example)
        margin: 10,        // Spacing above and below the line
        width: '90%',              // Makes the line span the full width of its container
        borderRadius: 10,
    },
});

export default Line;  // Export Line instead of Title
