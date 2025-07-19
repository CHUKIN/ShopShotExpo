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

const NETWORK_DELAY_MS = 2000;

export const uploadToBackend = async (data: UploadData): Promise<UploadResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY_MS));
  
  // Mock upload - simulate success
  return {
    success: true,
    message: 'Upload was successful',
    id: `upload_${Date.now()}`,
  };
};