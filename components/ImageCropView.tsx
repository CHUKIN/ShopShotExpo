import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  PanResponder, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { Image } from 'expo-image';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropViewProps {
  imageUri: string;
  onCropAreaChange: (cropArea: CropArea) => void;
}

const CROP_BORDER_COLOR = '#007AFF';
const MIN_CROP_SIZE = 100;

export function ImageCropView({ imageUri, onCropAreaChange }: ImageCropViewProps) {
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [actualImageDimensions, setActualImageDimensions] = useState<ImageDimensions>({ width: 0, height: 0, x: 0, y: 0 });
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
        const maxX = actualImageDimensions.width - cropArea.width;
        const maxY = actualImageDimensions.height - cropArea.height;

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

  const calculateActualImageDimensions = (containerWidth: number, containerHeight: number, originalWidth: number, originalHeight: number) => {
    // Calculate how the image fits in the container with "contain" mode
    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = originalWidth / originalHeight;
    
    let actualWidth, actualHeight, actualX, actualY;
    
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider - fit to width
      actualWidth = containerWidth;
      actualHeight = containerWidth / imageAspectRatio;
      actualX = 0;
      actualY = (containerHeight - actualHeight) / 2;
    } else {
      // Image is taller - fit to height
      actualWidth = containerHeight * imageAspectRatio;
      actualHeight = containerHeight;
      actualX = (containerWidth - actualWidth) / 2;
      actualY = 0;
    }
    
    const dimensions = {
      width: actualWidth,
      height: actualHeight,
      x: actualX,
      y: actualY,
    };
    
    setActualImageDimensions(dimensions);
    return dimensions;
  };

  const setupInitialCrop = (imageDimensions: ImageDimensions) => {
    const initialWidth = Math.min(imageDimensions.width * 0.6, 250);
    const initialHeight = Math.min(imageDimensions.height * 0.6, 250);
    const initialX = (imageDimensions.width - initialWidth) / 2;
    const initialY = (imageDimensions.height - initialHeight) / 2;

    const newCropArea = {
      x: initialX,
      y: initialY,
      width: initialWidth,
      height: initialHeight,
    };

    setCropArea(newCropArea);
    
    // Notify parent of initial crop area (relative to original image)
    onCropAreaChange({
      x: initialX / imageDimensions.width,
      y: initialY / imageDimensions.height,
      width: initialWidth / imageDimensions.width,
      height: initialHeight / imageDimensions.height,
    });
  };

  const notifyCropChange = () => {
    if (actualImageDimensions.width > 0 && actualImageDimensions.height > 0) {
      onCropAreaChange({
        x: cropArea.x / actualImageDimensions.width,
        y: cropArea.y / actualImageDimensions.height,
        width: cropArea.width / actualImageDimensions.width,
        height: cropArea.height / actualImageDimensions.height,
      });
    }
  };

  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
    
    // If we already have original image size, calculate dimensions immediately
    if (originalImageSize.width > 0 && originalImageSize.height > 0) {
      const imageDimensions = calculateActualImageDimensions(width, height, originalImageSize.width, originalImageSize.height);
      setupInitialCrop(imageDimensions);
    }
  };

  const handleImageLoad = (event: any) => {
    const { source } = event;
    if (source && source.width && source.height) {
      setOriginalImageSize({ width: source.width, height: source.height });
      
      // If we already have container layout, calculate dimensions immediately
      if (containerLayout.width > 0 && containerLayout.height > 0) {
        const imageDimensions = calculateActualImageDimensions(containerLayout.width, containerLayout.height, source.width, source.height);
        setupInitialCrop(imageDimensions);
      }
    }
  };

  const adjustCropSize = (delta: number) => {
    const maxWidth = actualImageDimensions.width - cropArea.x;
    const maxHeight = actualImageDimensions.height - cropArea.y;
    
    setCropArea(prev => ({
      ...prev,
      width: Math.max(MIN_CROP_SIZE, Math.min(maxWidth, prev.width + delta)),
      height: Math.max(MIN_CROP_SIZE, Math.min(maxHeight, prev.height + delta)),
    }));
    
    setTimeout(notifyCropChange, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} onLayout={handleContainerLayout}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="contain"
          onLoad={handleImageLoad}
        />
        
        {/* Crop area overlay */}
        {actualImageDimensions.width > 0 && (
          <View style={styles.overlay}>
            <View
              style={[
                styles.cropArea,
                {
                  left: actualImageDimensions.x + cropArea.x,
                  top: actualImageDimensions.y + cropArea.y,
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