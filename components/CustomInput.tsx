import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={[styles.label, required && styles.requiredLabel]}>
        {label}{required && ' *'}
      </Text>
      
      <Controller
        control={control}
        name={name}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              multiline ? styles.textArea : styles.textInput,
              error && styles.inputError
            ]}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        )}
      />
      
      {error && (
        <Text style={styles.errorText}>{error.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: 'normal',
  },
  requiredLabel: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 4,
  },
});