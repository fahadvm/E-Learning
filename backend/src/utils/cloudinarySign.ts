import { v2 as cloudinary } from 'cloudinary';

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
        console.error('Error generating signed Cloudinary URL:', error);
        return url;
    }
};

/**
 * Signs all secure URLs within a course object.
 * @param course The course object (ICourse or similar)
 */
export const signCourseUrls = (course: any): any => {
    if (!course) return course;

    // Handle Mongoose documents by converting to object if necessary
    const courseObj = course.toObject ? course.toObject() : course;

    if (courseObj.coverImage) {
        courseObj.coverImage = getSignedUrl(courseObj.coverImage);
    }

    if (courseObj.modules) {
        courseObj.modules.forEach((module: any) => {
            if (module.lessons) {
                module.lessons.forEach((lesson: any) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = getSignedUrl(lesson.videoFile);
                    }
                });
            }
        });
    }

    // Handle courseStructure (for analytics)
    if (courseObj.courseStructure) {
        courseObj.courseStructure.forEach((module: any) => {
            if (module.lessons) {
                module.lessons.forEach((lesson: any) => {
                    if (lesson.videoFile) {
                        lesson.videoFile = getSignedUrl(lesson.videoFile);
                    }
                });
            }
        });
    }

    return courseObj;
};
