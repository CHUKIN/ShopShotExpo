import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { uploadToBackend, UploadData } from '../services/uploadService';
import { ImagePreview } from '../components/ImagePreview';
import { UploadForm } from '../components/UploadForm';
import { validateImageUri } from '../utils/validationUtils';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

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
  });

  const onSubmit = async (data: FormData) => {
    if (!validateImageUri(imageUri)) {
      showErrorToast('No image selected');
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
        showSuccessToast(result.message, () => {
          router.replace('/');
        });
      } else {
        showErrorToast('Upload failed. Please try again.');
      }
    } catch (error) {
      showErrorToast('Network error. Please try again.');
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