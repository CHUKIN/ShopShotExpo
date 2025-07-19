import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ImageCropView } from '../components/ImageCropView';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CropDemoScreen() {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  // Sample image for demonstration
  const sampleImageUri = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

  const handleCropAreaChange = (newCropArea: CropArea) => {
    setCropArea(newCropArea);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interactive Crop Demo</Text>
      <Text style={styles.subtitle}>Drag to move • Use +/- buttons to resize</Text>
      
      <View style={styles.imageContainer}>
        <ImageCropView
          imageUri={sampleImageUri}
          onCropAreaChange={handleCropAreaChange}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Crop Area:</Text>
        <Text style={styles.infoText}>
          X: {(cropArea.x * 100).toFixed(1)}% 
          Y: {(cropArea.y * 100).toFixed(1)}%
        </Text>
        <Text style={styles.infoText}>
          Width: {(cropArea.width * 100).toFixed(1)}% 
          Height: {(cropArea.height * 100).toFixed(1)}%
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Crop & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});