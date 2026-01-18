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
exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const logger_1 = __importDefault(require("./logger"));
const uploadToCloudinary = (buffer_1, ...args_1) => __awaiter(void 0, [buffer_1, ...args_1], void 0, function* (buffer, folder = 'chat-uploads', resourceType = 'auto', type = 'upload') {
    const publicId = `upload-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: folder,
            public_id: publicId,
            resource_type: resourceType,
            type: type,
            overwrite: false,
        }, (error, result) => {
            if (error) {
                logger_1.default.error('Cloudinary upload failed:', error);
                return reject(error);
            }
            if (!(result === null || result === void 0 ? void 0 : result.secure_url))
                return reject(new Error('No URL returned'));
            resolve(result.secure_url);
        });
        uploadStream.end(buffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
