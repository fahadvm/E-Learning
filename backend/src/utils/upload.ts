import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (buffer: Buffer, folder: string = "chat-uploads", resourceType: "auto" | "image" | "video" | "raw" = "auto"): Promise<string> => {
    const publicId = `upload-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                public_id: publicId,
                resource_type: resourceType,
                overwrite: false,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed:", error);
                    return reject(error);
                }
                if (!result?.secure_url) return reject(new Error("No URL returned"));
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};
