import { Alert } from 'react-native';

export const showSuccessToast = (message: string, onClose?: () => void) => {
  // Display a success message using Alert. In a real app, consider using a proper toast library.
  Alert.alert('Success', message, [
    {
      text: 'OK',
      onPress: onClose,
    },
  ]);
};

export const showErrorToast = (message: string) => {
  Alert.alert('Error', message);
};