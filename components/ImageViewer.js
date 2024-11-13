// Import necessary components from React Native
import { StyleSheet, Image } from 'react-native';

// ImageViewer component that accepts two props:
// - placeholderImageSource: default image to show
// - selectedImage: URI of the user-selected image
export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  // Determine which image to display:
  // If selectedImage exists, use it; otherwise, use the placeholder
  const imageSource = selectedImage ? { uri: selectedImage } : placeholderImageSource;
  
  // Render the Image component with the determined source
  return (
    <Image source={imageSource} style={styles.image} />
  );
}

// Styles for the image
const styles = StyleSheet.create({
  image: {
    width: 320, // Fixed width for the image
    height: 440, // Fixed height for the image
    borderRadius: 18, // Rounded corners
  },
});