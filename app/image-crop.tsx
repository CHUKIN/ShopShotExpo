import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { CustomButton } from '../components/CustomButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImageCropScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCrop = async () => {
    if (!imageUri || typeof imageUri !== 'string') {
      Alert.alert('Error', 'No image to crop');
      return;
    }

    setIsProcessing(true);
    try {
      // For now, we'll just resize the image to fit screen dimensions
      // In a real implementation, you'd add crop area selection UI
      const maxDimension = Math.min(screenWidth * 0.8, screenHeight * 0.6);
      
      const croppedImage = await manipulateAsync(
        imageUri,
        [
          { resize: { width: maxDimension } }
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      router.push({
        pathname: '/upload-form',
        params: { 
          imageUri: croppedImage.uri,
          width: croppedImage.width,
          height: croppedImage.height,
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            source={{ uri: imageUri as string }}
            style={styles.image}
            contentFit="contain"
          />
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Next"
          onPress={handleCrop}
          loading={isProcessing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});