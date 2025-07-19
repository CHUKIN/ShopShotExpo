import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';

interface FormData {
  title: string;
  description?: string;
}

interface UploadFormProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  control,
  errors,
  onSubmit,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <CustomInput
        name="title"
        control={control}
        label="Title"
        placeholder="Enter a title for your photo"
        required
        error={errors.title}
      />

      <CustomInput
        name="description"
        control={control}
        label="Description"
        placeholder="Enter a description (optional)"
        multiline
        numberOfLines={3}
        error={errors.description}
      />

      <CustomButton
        title="Send"
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});