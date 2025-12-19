"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.TeacherCourseService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const mongoose_1 = require("mongoose");
const Course_1 = require("../../models/Course");
let TeacherCourseService = class TeacherCourseService {
    constructor(_courseRepository, _resourceRepository, _notificationService, _companyRepository, _employeeRepository, _teacherRepository) {
        this._courseRepository = _courseRepository;
        this._resourceRepository = _resourceRepository;
        this._notificationService = _notificationService;
        this._companyRepository = _companyRepository;
        this._employeeRepository = _employeeRepository;
        this._teacherRepository = _teacherRepository;
    }
    // Helper for Cloudinary upload
    uploadToCloudinary(file_1, folder_1) {
        return __awaiter(this, arguments, void 0, function* (file, folder, resourceType = 'auto') {
            return new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => {
                    if (error || !result)
                        reject(error || new Error('Upload failed'));
                    else
                        resolve(result.secure_url);
                }).end(file.buffer);
            });
        });
    }
    createCourse(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            // Dependency Rule: If teacher is not verified → course submission blocked
            const teacher = yield this._teacherRepository.findById(teacherId);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Allow creating drafts, but protect submission?
            // "If teacher is not verified → course submission blocked"
            // Assuming this means they can't even create a course? Or just can't submit?
            // "Teacher clicks 'Submit for Review'" - implies creation might typically be a draft first.
            // However, if the teacher isn't verified, they shouldn't be engaging in course creation flows usually.
            // Let's enforce strict: Must be verified to create any course (Draft or otherwise) logic from requirement "Only verified teachers can create courses".
            if (!teacher.isVerified) {
                (0, ResANDError_1.throwError)('You must be a verified teacher to create courses.', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            // Map files by fieldname
            const filesMap = {};
            (req.files || []).forEach(file => filesMap[file.fieldname] = file);
            // Parse modules
            let modulesBody = [];
            modulesBody = JSON.parse(req.body.modules || '[]');
            const modules = [];
            for (const [moduleIndex, module] of modulesBody.entries()) {
                const newModule = {
                    title: module.title,
                    description: module.description,
                    lessons: [],
                };
                if (Array.isArray(module.lessons)) {
                    for (const [lessonIndex, lesson] of module.lessons.entries()) {
                        let videoFileUrl = '';
                        let thumbnailUrl = '';
                        const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
                        if (videoFile)
                            videoFileUrl = yield this.uploadToCloudinary(videoFile, 'course_videos', 'video');
                        const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
                        if (thumbnail)
                            thumbnailUrl = yield this.uploadToCloudinary(thumbnail, 'course_thumbnails', 'image');
                        newModule.lessons.push({
                            title: lesson.title,
                            description: lesson.description || '',
                            duration: parseInt(((_b = lesson.duration) === null || _b === void 0 ? void 0 : _b.toString()) || '0', 10),
                            videoFile: videoFileUrl,
                            thumbnail: thumbnailUrl,
                        });
                    }
                }
                modules.push(newModule);
            }
            // Upload cover image
            let coverImageUrl = '';
            const coverImage = filesMap['coverImage'];
            if (coverImage)
                coverImageUrl = yield this.uploadToCloudinary(coverImage, 'course_covers', 'image');
            // Construct course DTO
            const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : (_c = req.body.price) !== null && _c !== void 0 ? _c : 0;
            const isSubmitted = req.body.isPublished === 'true';
            const courseData = {
                title: req.body.title,
                subtitle: req.body.subtitle || '',
                description: req.body.description,
                category: req.body.category,
                level: req.body.level,
                language: req.body.language,
                isTechnicalCourse: req.body.isTechnicalCourse,
                price,
                coverImage: coverImageUrl,
                learningOutcomes: JSON.parse(req.body.learningOutcomes || '[]'),
                requirements: JSON.parse(req.body.requirements || '[]'),
                // If submitting, set pending and keep unpublished. If draft, set draft and unpublished.
                isPublished: false,
                status: isSubmitted ? Course_1.CourseStatus.PENDING : Course_1.CourseStatus.DRAFT,
                totalDuration: req.body.totalDuration ? Number(req.body.totalDuration) : undefined,
                modules,
                teacherId: new mongoose_1.Types.ObjectId(teacherId),
            };
            // Validation
            if (!courseData.title || !courseData.description || !courseData.category) {
                throw new Error(ResponseMessages_1.MESSAGES.TITLE_DESCRIPTION_CATEGORY_REQUIRED);
            }
            if (courseData.modules.length === 0) {
                throw new Error(ResponseMessages_1.MESSAGES.AT_LEAST_ONE_MODULE_REQUIRED);
            }
            const newCourse = yield this._courseRepository.create(courseData);
            // If submitted, maybe notify admin? (Implementation detail, skipping for now unless explicit)
            return newCourse;
        });
    }
    getCoursesByTeacherId(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._courseRepository.findByTeacherId(teacherId);
        });
    }
    getCourseByIdWithTeacherId(courseId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return course;
        });
    }
    uploadResource(courseId, title, file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!file)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.FILE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (course.isBlocked) {
                (0, ResANDError_1.throwError)('Cannot upload resources to a blocked course.', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            const fileType = (_a = file.originalname.split('.').pop()) !== null && _a !== void 0 ? _a : 'unknown';
            const resourceType = fileType === 'pdf' ? 'raw' : 'auto';
            const uploadedUrl = yield this.uploadToCloudinary(file, 'course_resources', resourceType);
            return this._resourceRepository.uploadResource({
                courseId: new mongoose_1.Types.ObjectId(courseId),
                title,
                fileUrl: uploadedUrl,
                fileType,
            });
        });
    }
    getResources(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._resourceRepository.getResourcesByCourse(courseId);
        });
    }
    deleteResource(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._resourceRepository.deleteResource(resourceId);
        });
    }
    editCourse(courseId, teacherId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // 1. Verify ownership
            const existingCourse = yield this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
            if (!existingCourse) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            if (existingCourse.isBlocked) {
                (0, ResANDError_1.throwError)('This course is blocked by admin and cannot be edited. Reason: ' + (existingCourse.blockReason || 'No reason provided'), HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            // 2. Handle files similar to create
            const filesMap = {};
            (req.files || []).forEach(file => filesMap[file.fieldname] = file);
            // 3. Parse modules
            let modulesBody = [];
            try {
                modulesBody = JSON.parse(req.body.modules || '[]');
            }
            catch (e) {
                modulesBody = [];
            }
            const modules = [];
            // Reconstruct modules with potential new files or existing urls
            for (const [moduleIndex, module] of modulesBody.entries()) {
                const newModule = {
                    title: module.title,
                    description: module.description,
                    lessons: [],
                };
                if (Array.isArray(module.lessons)) {
                    for (const [lessonIndex, lesson] of module.lessons.entries()) {
                        let videoFileUrl = lesson.videoFile || ''; // retain existing if string
                        let thumbnailUrl = lesson.thumbnail || ''; // retain existing if string
                        // Check for new uploads
                        const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
                        if (videoFile)
                            videoFileUrl = yield this.uploadToCloudinary(videoFile, 'course_videos', 'video');
                        const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
                        if (thumbnail)
                            thumbnailUrl = yield this.uploadToCloudinary(thumbnail, 'course_thumbnails', 'image');
                        newModule.lessons.push({
                            title: lesson.title,
                            description: lesson.description || '',
                            duration: parseInt(((_a = lesson.duration) === null || _a === void 0 ? void 0 : _a.toString()) || '0', 10),
                            videoFile: videoFileUrl,
                            thumbnail: thumbnailUrl,
                        });
                    }
                }
                modules.push(newModule);
            }
            // 4. Handle cover image
            let coverImageUrl = (existingCourse === null || existingCourse === void 0 ? void 0 : existingCourse.coverImage) || '';
            const coverImage = filesMap['coverImage'];
            if (coverImage)
                coverImageUrl = yield this.uploadToCloudinary(coverImage, 'course_covers', 'image');
            // 5. Construct update object
            const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : (_b = req.body.price) !== null && _b !== void 0 ? _b : 0;
            // Parse arrays if they are strings
            const learningOutcomes = typeof req.body.learningOutcomes === 'string'
                ? JSON.parse(req.body.learningOutcomes)
                : req.body.learningOutcomes;
            const requirements = typeof req.body.requirements === 'string'
                ? JSON.parse(req.body.requirements)
                : req.body.requirements;
            const updates = {
                title: req.body.title,
                subtitle: req.body.subtitle || '',
                description: req.body.description,
                category: req.body.category,
                level: req.body.level,
                language: req.body.language,
                isTechnicalCourse: req.body.isTechnicalCourse === true,
                price,
                coverImage: coverImageUrl,
                learningOutcomes: learningOutcomes || [],
                requirements: requirements || [],
                isPublished: req.body.isPublished === 'true',
                totalDuration: req.body.totalDuration ? Number(req.body.totalDuration) : undefined,
                modules: modules, // casting to any to match ICourse module structure if strict typing complains
            };
            const updatedCourse = yield this._courseRepository.editCourse(courseId, updates);
            if (updatedCourse) {
                // Notify Companies (those who have bought seats)
                // For simplicity, let's notify all companies for now as per requirement "trigger on Company"
                const companies = yield this._companyRepository.findAll();
                for (const company of companies) {
                    yield this._notificationService.createNotification(company._id.toString(), 'Course Updated', `The course "${updatedCourse.title}" has been updated by the teacher.`, 'course', 'company', '/company/courses');
                }
                // Notify Employees who are enrolled in this course
                // Find all employees who have this course assigned
                // (This is a bit more complex, I'll do a simple query)
                const enrolledEmployees = yield this._employeeRepository.findAll(); // Optimization: should find by courseId
                const affectedEmployees = enrolledEmployees.filter(emp => { var _a; return (_a = emp.coursesAssigned) === null || _a === void 0 ? void 0 : _a.some(id => id.toString() === courseId); });
                for (const emp of affectedEmployees) {
                    yield this._notificationService.createNotification(emp._id.toString(), 'Course Updated', `Content for "${updatedCourse.title}" has been updated.`, 'course', 'employee', '/employee/my-courses');
                }
            }
            return updatedCourse;
        });
    }
};
exports.TeacherCourseService = TeacherCourseService;
exports.TeacherCourseService = TeacherCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseResourceRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.TeacherRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], TeacherCourseService);
