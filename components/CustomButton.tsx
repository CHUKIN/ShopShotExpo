import React from 'react';
import { Button, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
}) => {
  return (
    <Button
      variant={variant}
      onPress={onPress}
      isDisabled={disabled || loading}
      width="$full"
      height="$12"
    >
      {loading && <ButtonSpinner mr="$1" />}
      <ButtonText>{loading ? 'Loading...' : title}</ButtonText>
    </Button>
  );
};