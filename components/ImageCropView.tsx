import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  PanResponder, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { Image } from 'expo-image';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

const CROP_BORDER_COLOR = '#007AFF';
const MIN_CROP_SIZE = 100;

export function ImageCropView({ imageUri, onCropAreaChange }: ImageCropViewProps) {
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Store the initial position when pan starts
        setDragStartPos({ x: cropArea.x, y: cropArea.y });
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const maxX = imageLayout.width - cropArea.width;
        const maxY = imageLayout.height - cropArea.height;

        const newX = Math.max(0, Math.min(maxX, dragStartPos.x + dx));
        const newY = Math.max(0, Math.min(maxY, dragStartPos.y + dy));

        setCropArea(prev => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      },

      onPanResponderRelease: () => {
        notifyCropChange();
      },
    })
  ).current;

  const setupInitialCrop = (layout: any) => {
    if (layout.width > 0 && layout.height > 0) {
      const initialWidth = Math.min(layout.width * 0.8, 300);
      const initialHeight = Math.min(layout.height * 0.8, 300);
      const initialX = (layout.width - initialWidth) / 2;
      const initialY = (layout.height - initialHeight) / 2;

      const newCropArea = {
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      };

      setCropArea(newCropArea);
      
      // Notify parent of initial crop area
      onCropAreaChange({
        x: initialX / layout.width,
        y: initialY / layout.height,
        width: initialWidth / layout.width,
        height: initialHeight / layout.height,
      });
    }
  };

  const notifyCropChange = () => {
    if (imageLayout.width > 0 && imageLayout.height > 0) {
      onCropAreaChange({
        x: cropArea.x / imageLayout.width,
        y: cropArea.y / imageLayout.height,
        width: cropArea.width / imageLayout.width,
        height: cropArea.height / imageLayout.height,
      });
    }
  };

  const handleImageLayout = (event: any) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    const newLayout = { width, height, x, y };
    setImageLayout(newLayout);
    setupInitialCrop(newLayout);
  };

  const adjustCropSize = (delta: number) => {
    const maxWidth = imageLayout.width - cropArea.x;
    const maxHeight = imageLayout.height - cropArea.y;
    
    setCropArea(prev => ({
      ...prev,
      width: Math.max(MIN_CROP_SIZE, Math.min(maxWidth, prev.width + delta)),
      height: Math.max(MIN_CROP_SIZE, Math.min(maxHeight, prev.height + delta)),
    }));
    
    setTimeout(notifyCropChange, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="contain"
          onLayout={handleImageLayout}
        />
        
        {/* Crop area overlay */}
        {imageLayout.width > 0 && (
          <View style={styles.overlay}>
            <View
              style={[
                styles.cropArea,
                {
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.cropHandle} />
            </View>
          </View>
        )}
      </View>
      
      {/* Size adjustment controls */}
      <View style={styles.controls}>
        <Text style={styles.instructionText}>Drag to move • Use buttons to resize</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => adjustCropSize(-20)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => adjustCropSize(20)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: CROP_BORDER_COLOR,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  cropHandle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: CROP_BORDER_COLOR,
    borderRadius: 10,
  },
  controls: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    backgroundColor: CROP_BORDER_COLOR,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});