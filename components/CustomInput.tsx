import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
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
  numberOfLines = 1,
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
              styles.input,
              multiline && styles.multilineInput,
              error && styles.errorInput,
            ]}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
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
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  requiredLabel: {
    color: '#d32f2f',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 12,
  },
  errorInput: {
    borderColor: '#d32f2f',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 4,
  },
});