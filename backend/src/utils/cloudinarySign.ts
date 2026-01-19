import { v2 as cloudinary } from 'cloudinary';
import logger from './logger';

/**
 * Extracts the public_id and resource_type from a Cloudinary URL.
 * Handles both public (upload) and authenticated/private assets.
 */
export const parseCloudinaryUrl = (url: string) => {
    if (!url) return null;

    // Example URL: https://res.cloudinary.com/demo/video/upload/v1619000000/folder/video_name.mp4
    // Pattern: /res.cloudinary.com/([^/]+)/([^/]+)/([^/]+)/v[0-9]+/(.+)\.[a-z0-9]+$/
    const regex = /res\.cloudinary\.com\/[^/]+\/([^/]+)\/([^/]+)\/v\d+\/(.+)\.[^.]+$/;
    const match = url.match(regex);

    if (match) {
        return {
            resourceType: match[1] as 'image' | 'video' | 'raw',
            type: match[2], // 'upload', 'authenticated', 'private'
            publicId: match[3],
        };
    }
    return null;
};

/**
 * Generates a signed URL for a Cloudinary asset.
 * @param url The original Cloudinary URL
 * @param expiresIn Time in seconds from now (default 1 hour)
 */
export const getSignedUrl = (url: string, expiresIn: number = 3600): string => {
    if (!url) return '';

    // If it's already a signed URL or not a cloudinary URL, return as is
    if (!url.includes('res.cloudinary.com')) return url;

    const parsed = parseCloudinaryUrl(url);
    if (!parsed) return url;

    // If it's already an authenticated asset, we sign it.
    // If it's a public asset (type === 'upload'), we can still sign it if we want to restrict it,
    // but usually, we'd want to move it to 'authenticated' first.
    // For now, let's sign whatever we have.

    try {
        return cloudinary.url(parsed.publicId, {
            resource_type: parsed.resourceType,
            type: parsed.type, // Use the original type from URL
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + expiresIn,
            secure: true,
        });
    } catch (error) {
        logger.error('Error generating signed Cloudinary URL:', error);
        return url;
    }
};

interface SignableLesson {
    videoFile?: string;
    thumbnail?: string;
}

interface SignableModule {
    lessons?: SignableLesson[];
}

interface SignableCourse {
    coverImage?: string;
    modules?: SignableModule[];
    courseStructure?: SignableModule[];
    toObject?: () => object;
}

/**
 * Signs all secure URLs within a course object.
 * @param course The course object (ICourse, DTO, or analytics object)
 */
export const signCourseUrls = <T extends object>(course: T): T => {
    if (!course) return course;

    // Handle Mongoose documents or plain objects
    const courseObj = (course as SignableCourse).toObject
        ? (course as SignableCourse).toObject!()
        : { ...(course as SignableCourse) };

    const signable = courseObj as SignableCourse;

    if (signable.coverImage) {
        signable.coverImage = getSignedUrl(signable.coverImage);
    }

    if (signable.modules) {
        signable.modules.forEach((module: SignableModule) => {
            if (module.lessons) {
                module.lessons.forEach((lesson: SignableLesson) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = getSignedUrl(lesson.videoFile);
                    }
                    if (lesson.thumbnail) {
                        lesson.thumbnail = getSignedUrl(lesson.thumbnail);
                    }
                });
            }
        });
    }

    // Handle courseStructure (for analytics)
    if (signable.courseStructure) {
        signable.courseStructure.forEach((module: SignableModule) => {
            if (module.lessons) {
                module.lessons.forEach((lesson: SignableLesson) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = getSignedUrl(lesson.videoFile);
                    }
                    if (lesson.thumbnail) {
                        lesson.thumbnail = getSignedUrl(lesson.thumbnail);
                    }
                });
            }
        });
    }

    return signable as T;
};
