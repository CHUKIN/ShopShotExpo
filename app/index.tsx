
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActionSheetIOS, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
      return;
    }
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      router.push({ pathname: "/PhotoResultScreen", params: { imageUri: result.assets[0].uri } });
    }
  };

  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }
    setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      router.push({ pathname: "/PhotoResultScreen", params: { imageUri: result.assets[0].uri } });
    }
  };

  const handleFabPress = async () => {
    // Show simple action sheet for camera/gallery
    if (Platform.OS === "web") {
      pickImage();
      return;
    }
    const options = ["Take Photo", "Choose from Gallery", "Cancel"];
    let choice = false;
    if (Platform.OS === "ios") {
      await new Promise<void>((resolve) => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 2,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) choice = true; // Take Photo
            if (buttonIndex === 1) choice = false; // Gallery
            resolve();
          }
        );
      });
    } else {
      choice = window.confirm("Take Photo? Press Cancel for Gallery.");
    }
    if (choice) {
      takePhoto();
    } else {
      pickImage();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to ShopShotExpo!</Text>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    left: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
