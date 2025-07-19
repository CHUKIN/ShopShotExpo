import React from 'react';
import { 
  FormControl, 
  FormControlLabel, 
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Textarea,
  TextareaInput
} from '@gluestack-ui/themed';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

interface CustomInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: FieldError;
  rules?: RegisterOptions;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  multiline = false,
  error,
  rules,
}) => {
  const validationRules = rules || (required ? { required: `${label} is required` } : {});

  return (
    <FormControl isInvalid={!!error} mb="$4">
      <FormControlLabel>
        <FormControlLabelText 
          color={required ? '$red600' : '$black'} 
          fontWeight={required ? 'bold' : 'normal'}
        >
          {label}{required && ' *'}
        </FormControlLabelText>
      </FormControlLabel>
      
      <Controller
        control={control}
        name={name}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          multiline ? (
            <Textarea>
              <TextareaInput
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Textarea>
          ) : (
            <Input>
              <InputField
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
          )
        )}
      />
      
      {error && (
        <FormControlError>
          <FormControlErrorText>{error.message}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};