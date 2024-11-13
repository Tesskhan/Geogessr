// Import necessary components from React Native
import { StyleSheet, View, Pressable, Text } from 'react-native';

// Button component that accepts label, theme, and onPress props
export default function Button({ label, theme, onPress }) {
  // If theme is "primary", return a styled button with an icon
  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[styles.button, { backgroundColor: "#FFE500" }]}
          onPress={onPress}
        >
          {/* Button text with custom color */}
          <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
}

// Styles for the button component
const styles = StyleSheet.create({
  buttonContainer: {
    width: 250, // Fixed width for consistency
    height: 60, // Fixed height for consistency
    marginHorizontal: 20, // Horizontal margin
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    padding: 3,
    flexDirection: 'row',
  },
  button: {
    borderRadius: 10,
    width: '50%', // Take up all available width
    height: '100%', // Take up all available height
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
});