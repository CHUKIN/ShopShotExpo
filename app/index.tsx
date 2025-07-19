
import { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { 
  showImageSourceActionSheet, 
  takePhotoFromCamera, 
  pickImageFromGallery 
} from "../utils/imageUtils";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFabPress = async () => {
    setLoading(true);
    try {
      const choice = await showImageSourceActionSheet();
      
      if (choice === 'cancel') {
        setLoading(false);
        return;
      }

      let result = null;
      if (choice === 'camera') {
        result = await takePhotoFromCamera();
        if (!result) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        }
      } else if (choice === 'gallery') {
        result = await pickImageFromGallery();
        if (!result) {
          Alert.alert('Permission Denied', 'Photo library permission is required to select images');
        }
      }

      if (result) {
        router.push({
          pathname: '/image-crop',
          params: {
            imageUri: result.uri,
            width: result.width.toString(),
            height: result.height.toString(),
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error('Image selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to ShopShotExpo!</Text>
      <FloatingActionButton 
        onPress={handleFabPress}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
