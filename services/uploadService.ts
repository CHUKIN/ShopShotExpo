export interface UploadData {
  imageUri: string;
  title: string;
  description?: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  id?: string;
}

export const uploadToBackend = async (data: UploadData): Promise<UploadResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock upload - simulate success
  return {
    success: true,
    message: 'Upload was successful',
    id: `upload_${Date.now()}`,
  };
};