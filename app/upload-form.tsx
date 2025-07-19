import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { uploadToBackend, UploadData } from '../services/uploadService';
import { ImagePreview } from '../components/ImagePreview';
import { UploadForm } from '../components/UploadForm';

interface FormData {
  title: string;
  description?: string;
}

export default function UploadFormScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [isUploading, setIsUploading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
    rules: {
      title: {
        required: 'Title is required',
        minLength: {
          value: 1,
          message: 'Title cannot be empty',
        },
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!imageUri || typeof imageUri !== 'string') {
      Alert.alert('Error', 'No image selected');
      return;
    }

    setIsUploading(true);
    try {
      const uploadData: UploadData = {
        imageUri,
        title: data.title,
        description: data.description,
      };

      const result = await uploadToBackend(uploadData);
      
      if (result.success) {
        Alert.alert('Success', result.message, [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Upload failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImagePreview imageUri={imageUri as string} />
      
      <UploadForm 
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isUploading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
});