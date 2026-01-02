// utils/uploadPDF.ts
import cloudinary from '../config/cloudinary';
import logger from './logger';

export const uploadPDFtoCloudinary = async (buffer: Buffer): Promise<string> => {
  const publicId = `cert-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'certificates',
        public_id: publicId,
        resource_type: 'raw',          // Correct for PDFs
        format: 'pdf',
        overwrite: false,              // No corruption
        tags: ['certificate', 'pdf'],
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload failed:', error);
          return reject(error);
        }
        if (!result?.secure_url) return reject(new Error('No URL returned'));

        // Use the raw secure_url – NO extra flags or transforms
        // This will be: https://res.cloudinary.com/ds4yhisr0/raw/upload/vXXXX/certificates/cert-XXXX.pdf
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};