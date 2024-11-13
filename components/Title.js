import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Title = ({ children }) => {
    return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
    title: {
        color: '#FFE500', // Set text color to yellow
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold', // Make the title bold for emphasis
    },
});

export default Title;