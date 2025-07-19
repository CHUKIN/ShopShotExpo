/**
 * Validates if the imageUri parameter is a valid string
 * @param imageUri - The image URI to validate
 * @returns true if valid, false otherwise
 */
export const validateImageUri = (imageUri: any): imageUri is string => {
  return imageUri && typeof imageUri === 'string';
};