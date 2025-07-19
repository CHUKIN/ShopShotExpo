import { Alert, Platform } from 'react-native';

export const showSuccessToast = (message: string, onClose?: () => void) => {
  // For iOS, we'll use Alert since expo-notifications might be overkill for this simple case
  // In a real app, you'd implement a proper toast library
  if (Platform.OS === 'ios') {
    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress: onClose,
      },
    ]);
  } else {
    // For other platforms, you could implement a different toast mechanism
    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress: onClose,
      },
    ]);
  }
};

export const showErrorToast = (message: string) => {
  Alert.alert('Error', message);
};