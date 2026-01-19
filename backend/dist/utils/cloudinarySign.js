"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signCourseUrls = exports.getSignedUrl = exports.parseCloudinaryUrl = void 0;
const cloudinary_1 = require("cloudinary");
const logger_1 = __importDefault(require("./logger"));
/**
 * Extracts the public_id and resource_type from a Cloudinary URL.
 * Handles both public (upload) and authenticated/private assets.
 */
const parseCloudinaryUrl = (url) => {
    if (!url)
        return null;
    // Example URL: https://res.cloudinary.com/demo/video/upload/v1619000000/folder/video_name.mp4
    // Pattern: /res.cloudinary.com/([^/]+)/([^/]+)/([^/]+)/v[0-9]+/(.+)\.[a-z0-9]+$/
    const regex = /res\.cloudinary\.com\/[^/]+\/([^/]+)\/([^/]+)\/v\d+\/(.+)\.[^.]+$/;
    const match = url.match(regex);
    if (match) {
        return {
            resourceType: match[1],
            type: match[2], // 'upload', 'authenticated', 'private'
            publicId: match[3],
        };
    }
    return null;
};
exports.parseCloudinaryUrl = parseCloudinaryUrl;
/**
 * Generates a signed URL for a Cloudinary asset.
 * @param url The original Cloudinary URL
 * @param expiresIn Time in seconds from now (default 1 hour)
 */
const getSignedUrl = (url, expiresIn = 3600) => {
    if (!url)
        return '';
    // If it's already a signed URL or not a cloudinary URL, return as is
    if (!url.includes('res.cloudinary.com'))
        return url;
    const parsed = (0, exports.parseCloudinaryUrl)(url);
    if (!parsed)
        return url;
    // If it's already an authenticated asset, we sign it.
    // If it's a public asset (type === 'upload'), we can still sign it if we want to restrict it,
    // but usually, we'd want to move it to 'authenticated' first.
    // For now, let's sign whatever we have.
    try {
        return cloudinary_1.v2.url(parsed.publicId, {
            resource_type: parsed.resourceType,
            type: parsed.type, // Use the original type from URL
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + expiresIn,
            secure: true,
        });
    }
    catch (error) {
        logger_1.default.error('Error generating signed Cloudinary URL:', error);
        return url;
    }
};
exports.getSignedUrl = getSignedUrl;
/**
 * Signs all secure URLs within a course object.
 * @param course The course object (ICourse, DTO, or analytics object)
 */
const signCourseUrls = (course) => {
    if (!course)
        return course;
    // Handle Mongoose documents or plain objects
    const courseObj = course.toObject
        ? course.toObject()
        : Object.assign({}, course);
    const signable = courseObj;
    if (signable.coverImage) {
        signable.coverImage = (0, exports.getSignedUrl)(signable.coverImage);
    }
    if (signable.modules) {
        signable.modules.forEach((module) => {
            if (module.lessons) {
                module.lessons.forEach((lesson) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = (0, exports.getSignedUrl)(lesson.videoFile);
                    }
                    if (lesson.thumbnail) {
                        lesson.thumbnail = (0, exports.getSignedUrl)(lesson.thumbnail);
                    }
                });
            }
        });
    }
    // Handle courseStructure (for analytics)
    if (signable.courseStructure) {
        signable.courseStructure.forEach((module) => {
            if (module.lessons) {
                module.lessons.forEach((lesson) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = (0, exports.getSignedUrl)(lesson.videoFile);
                    }
                    if (lesson.thumbnail) {
                        lesson.thumbnail = (0, exports.getSignedUrl)(lesson.thumbnail);
                    }
                });
            }
        });
    }
    return signable;
};
exports.signCourseUrls = signCourseUrls;
