"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPDFtoCloudinary = void 0;
// utils/uploadPDF.ts
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const logger_1 = __importDefault(require("./logger"));
const uploadPDFtoCloudinary = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const publicId = `cert-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: 'certificates',
            public_id: publicId,
            resource_type: 'raw', // Correct for PDFs
            format: 'pdf',
            overwrite: false, // No corruption
            tags: ['certificate', 'pdf'],
        }, (error, result) => {
            if (error) {
                logger_1.default.error('Cloudinary upload failed:', error);
                return reject(error);
            }
            if (!(result === null || result === void 0 ? void 0 : result.secure_url))
                return reject(new Error('No URL returned'));
            // Use the raw secure_url – NO extra flags or transforms
            // This will be: https://res.cloudinary.com/ds4yhisr0/raw/upload/vXXXX/certificates/cert-XXXX.pdf
            resolve(result.secure_url);
        });
        uploadStream.end(buffer);
    });
});
exports.uploadPDFtoCloudinary = uploadPDFtoCloudinary;
