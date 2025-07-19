import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ImageCropView } from '../components/ImageCropView';
import { validateImageUri } from '../utils/validationUtils';
import { showErrorToast } from '../utils/toastUtils';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Simple button component to avoid gluestack UI issues
const SimpleButton: React.FC<{
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({ title, onPress, loading = false, disabled = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      (disabled || loading) && styles.buttonDisabled
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    <Text style={styles.buttonText}>
      {loading ? 'Processing...' : title}
    </Text>
  </TouchableOpacity>
);

export default function ImageCropScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
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
      // react-easy-crop provides pixel coordinates directly
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
        <SimpleButton
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
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});