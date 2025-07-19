import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS, Platform } from "react-native";

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
}

export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};

export const takePhotoFromCamera = async (): Promise<ImagePickerResult | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // We'll handle cropping separately
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width || 0,
      height: asset.height || 0,
    };
  }

  return null;
};

export const pickImageFromGallery = async (): Promise<ImagePickerResult | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // We'll handle cropping separately
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width || 0,
      height: asset.height || 0,
    };
  }

  return null;
};

export const showImageSourceActionSheet = (): Promise<'camera' | 'gallery' | 'cancel'> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Select from Gallery', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) resolve('camera');
          else if (buttonIndex === 1) resolve('gallery');
          else resolve('cancel');
        }
      );
    } else {
      // For non-iOS platforms, default to gallery
      resolve('gallery');
    }
  });
};