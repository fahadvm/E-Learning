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
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
let TeacherCourseService = class TeacherCourseService {
    constructor(_courseRepository) {
        this._courseRepository = _courseRepository;
    }
    createCourse(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                throw new Error(ResponseMessages_1.MESSAGES.UNAUTHORIZED);
            // Map files by fieldname
            const filesMap = {};
            (req.files || []).forEach(file => {
                filesMap[file.fieldname] = file;
            });
            // Parse modules JSON from frontend
            let modulesBody = [];
            try {
                modulesBody = JSON.parse(req.body.modules || '[]');
            }
            catch (error) {
                console.error('Failed to parse modules:', error);
                throw new Error('Invalid modules format');
            }
            const modules = [];
            for (const [moduleIndex, module] of modulesBody.entries()) {
                const newModule = {
                    title: module.title,
                    lessons: [],
                };
                if (Array.isArray(module.lessons)) {
                    for (const [lessonIndex, lesson] of module.lessons.entries()) {
                        let videoFileUrl = '';
                        let thumbnailUrl = '';
                        // Upload lesson video
                        const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
                        if (videoFile) {
                            try {
                                videoFileUrl = yield new Promise((resolve, reject) => {
                                    cloudinary_1.default.uploader.upload_stream({ resource_type: 'video', folder: 'course_videos' }, (error, result) => {
                                        if (error || !result)
                                            reject(new Error('Cloudinary video upload failed'));
                                        else
                                            resolve(result.secure_url);
                                    }).end(videoFile.buffer);
                                });
                            }
                            catch (error) {
                                console.error(`Video upload failed for module ${moduleIndex}, lesson ${lessonIndex}:`, error);
                            }
                        }
                        // Upload lesson thumbnail
                        const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
                        if (thumbnail) {
                            try {
                                thumbnailUrl = yield new Promise((resolve, reject) => {
                                    cloudinary_1.default.uploader.upload_stream({ resource_type: 'image', folder: 'course_thumbnails' }, (error, result) => {
                                        if (error || !result)
                                            reject(new Error('Cloudinary thumbnail upload failed'));
                                        else
                                            resolve(result.secure_url);
                                    }).end(thumbnail.buffer);
                                });
                            }
                            catch (error) {
                                console.error(`Thumbnail upload failed for module ${moduleIndex}, lesson ${lessonIndex}:`, error);
                            }
                        }
                        newModule.lessons.push({
                            title: lesson.title,
                            description: lesson.description || '',
                            duration: parseInt(lesson.duration) || 0,
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
            if (coverImage) {
                try {
                    coverImageUrl = yield new Promise((resolve, reject) => {
                        cloudinary_1.default.uploader.upload_stream({ resource_type: 'image', folder: 'course_covers' }, (error, result) => {
                            if (error || !result)
                                reject(new Error('Cloudinary cover image upload failed'));
                            else
                                resolve(result.secure_url);
                        }).end(coverImage.buffer);
                    });
                }
                catch (error) {
                    console.error('Cover image upload failed:', error);
                }
            }
            console.log("here just printing the req/bpdu :", req.body);
            // Construct course DTO
            const courseData = {
                title: req.body.title,
                subtitle: req.body.subtitle || '',
                description: req.body.description,
                category: req.body.category,
                level: req.body.level,
                language: req.body.language,
                price: parseFloat(req.body.price || '0'),
                coverImage: coverImageUrl,
                learningOutcomes: JSON.parse(req.body.learningOutcomes || '[]'),
                requirements: JSON.parse(req.body.requirements || '[]'),
                isPublished: req.body.isPublished === 'true',
                totalDuration: req.body.totalDuration || undefined,
                modules,
                teacherId,
            };
            // Validation
            if (!courseData.title || !courseData.description || !courseData.category) {
                throw new Error(ResponseMessages_1.MESSAGES.TITLE_DESCRIPTION_CATEGORY_REQUIRED);
            }
            if (courseData.modules.length === 0) {
                throw new Error(ResponseMessages_1.MESSAGES.AT_LEAST_ONE_MODULE_REQUIRED);
            }
            return yield this._courseRepository.create(courseData);
        });
    }
    getCoursesByTeacherId(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._courseRepository.findByTeacherId(teacherId);
            // if (!courses || courses.length === 0) {
            //   throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
            // }
            return courses;
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
};
exports.TeacherCourseService = TeacherCourseService;
exports.TeacherCourseService = TeacherCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __metadata("design:paramtypes", [Object])
], TeacherCourseService);
