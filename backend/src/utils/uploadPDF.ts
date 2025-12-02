import cloudinary from "../config/cloudinary";

export const uploadPDFtoCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "certificates",
        resource_type: "raw",    
        format: "pdf",           
        filename_override: `certificate-${Date.now()}.pdf`,
        public_id: `certificate-${Date.now()}`, 
        use_filename: true,
        unique_filename: false,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result!.secure_url);
      }
    );

    stream.end(buffer);
  });
};
