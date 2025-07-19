import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface ImagePreviewProps {
  imageUri: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUri }) => {
  if (!imageUri) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});