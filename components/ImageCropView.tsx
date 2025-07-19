import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Cropper from 'react-easy-crop';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropViewProps {
  imageUri: string;
  onCropAreaChange: (cropArea: CropArea) => void;
}

export function ImageCropView({ imageUri, onCropAreaChange }: ImageCropViewProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    // Convert the croppedAreaPixels to the format expected by the parent
    onCropAreaChange({
      x: croppedAreaPixels.x,
      y: croppedAreaPixels.y,
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    });
  }, [onCropAreaChange]);

  return (
    <View style={styles.container}>
      <View style={styles.cropContainer}>
        <Cropper
          image={imageUri}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid={true}
          style={{
            containerStyle: styles.cropperContainer,
            cropAreaStyle: styles.cropArea,
          }}
        />
      </View>
      
      {/* Instructions */}
      <View style={styles.controls}>
        <Text style={styles.instructionText}>
          Drag to move • Pinch to zoom • Drag corners to resize
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cropContainer: {
    flex: 1,
    position: 'relative',
  },
  cropperContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cropArea: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  controls: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});