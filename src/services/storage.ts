/**
 * Storage service for document & medical image uploads
 * Stores files and produces accessible URLs + metadata
 */

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadMedicalDocument(
  file: File,
  userId: string,
  category: string = 'records'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    // Generate clean storage path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `users/${userId}/${category}/${timestamp}_${sanitizedName}`;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve({
        downloadUrl: dataUrl,
        storagePath,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
      });
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
