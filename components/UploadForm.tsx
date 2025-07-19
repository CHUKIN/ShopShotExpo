import React from 'react';
import { VStack } from '@gluestack-ui/themed';
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
    <VStack flex={1} space="md">
      <CustomInput
        name="title"
        control={control}
        label="Title"
        placeholder="Enter a title for your photo"
        required
        error={errors.title}
        rules={{
          required: 'Title is required',
          minLength: {
            value: 1,
            message: 'Title cannot be empty',
          },
        }}
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
    </VStack>
  );
};