import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { CustomButton } from '../components/CustomButton';
import { ImageCropView } from '../components/ImageCropView';
import { validateImageUri } from '../utils/validationUtils';
import { showErrorToast } from '../utils/toastUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  const handleCrop = async () => {
    if (!validateImageUri(imageUri)) {
      showErrorToast('No image to crop');
      return;
    }

    setIsProcessing(true);
    try {
      // Get original image dimensions
      const originalImageUri = imageUri as string;
      
      // Apply the crop area selected by user
      const croppedImage = await manipulateAsync(
        originalImageUri,
        [
          {
            crop: {
              originX: cropArea.x,
              originY: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }
          }
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      router.replace({
        pathname: '/upload-form',
        params: { 
          imageUri: croppedImage.uri,
          width: croppedImage.width,
          height: croppedImage.height,
        }
      });
    } catch (error) {
      showErrorToast('Failed to process image');
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri && (
          <ImageCropView
            imageUri={imageUri as string}
            onCropAreaChange={setCropArea}
          />
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Crop & Continue"
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
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});