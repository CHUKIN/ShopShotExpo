import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, View } from 'react-native';

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
  const window = Dimensions.get('window');
  const imageWidth = window.width - 32;
  const imageHeight = imageWidth; // square for simplicity

  // Initial crop area (centered square)
  const [cropArea, setCropArea] = useState<CropArea>({
    x: imageWidth * 0.25,
    y: imageHeight * 0.25,
    width: imageWidth * 0.5,
    height: imageHeight * 0.5,
  });

  // Drag state
  const pan = useRef({ x: 0, y: 0 });
  const resizing = useRef(false);

  useEffect(() => {
    onCropAreaChange({
      x: Math.round(cropArea.x),
      y: Math.round(cropArea.y),
      width: Math.round(cropArea.width),
      height: Math.round(cropArea.height),
    });
  }, [cropArea, onCropAreaChange]);

  // PanResponder for moving crop area
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      pan.current = { x: gestureState.x0 - cropArea.x, y: gestureState.y0 - cropArea.y };
      resizing.current = false;
    },
    onPanResponderMove: (_, gestureState) => {
      if (!resizing.current) {
        // Move crop area
        let newX = gestureState.moveX - pan.current.x - 16; // 16 = horizontal padding
        let newY = gestureState.moveY - pan.current.y - 16; // 16 = vertical padding
        // Clamp to image bounds
        newX = Math.max(0, Math.min(newX, imageWidth - cropArea.width));
        newY = Math.max(0, Math.min(newY, imageHeight - cropArea.height));
        setCropArea(area => ({ ...area, x: newX, y: newY }));
      }
    },
  });

  // PanResponder for resizing (bottom-right corner)
  const resizeResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      resizing.current = true;
    },
    onPanResponderMove: (_, gestureState) => {
      if (resizing.current) {
        let newWidth = Math.max(50, Math.min(gestureState.moveX - cropArea.x - 16, imageWidth - cropArea.x));
        let newHeight = Math.max(50, Math.min(gestureState.moveY - cropArea.y - 16, imageHeight - cropArea.y));
        // Keep square aspect ratio
        const size = Math.min(newWidth, newHeight);
        setCropArea(area => ({ ...area, width: size, height: size }));
      }
    },
    onPanResponderRelease: () => {
      resizing.current = false;
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ width: imageWidth, height: imageHeight, alignSelf: 'center' }}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: imageWidth, height: imageHeight, borderRadius: 8 }}
          resizeMode="contain"
        />
        {/* Crop rectangle overlay */}
        <View
          style={[
            styles.cropRect,
            {
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Resize handle (bottom-right corner) */}
          <View
            style={styles.resizeHandle}
            {...resizeResponder.panHandlers}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0,122,255,0.1)',
    zIndex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  resizeHandle: {
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    right: -12,
    bottom: -12,
    zIndex: 3,
  },
});