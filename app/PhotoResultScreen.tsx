import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Image, StyleSheet, View } from "react-native";

export default function PhotoResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri as string }} style={styles.image} resizeMode="contain" />
      )}
      <Button title="Send" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 400,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
});
