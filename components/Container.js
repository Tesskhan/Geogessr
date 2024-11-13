import React from 'react';
import { View, StyleSheet } from 'react-native';

const Container = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Your desired background color
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        flex: 1,  // Allow the container to expand and fill available space
    },
});

export default Container;
