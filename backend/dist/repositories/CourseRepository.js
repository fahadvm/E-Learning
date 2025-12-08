"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const inversify_1 = require("inversify");
const Course_1 = require("../models/Course");
let CourseRepository = class CourseRepository {
    create(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.create(courseData);
        });
    }
    getFilteredCourses(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, category, level, language, sort = 'createdAt', order = 'desc', page = 1, limit = 8, } = filters;
            const query = {};
            if (search) {
                query.title = { $regex: search, $options: 'i' };
            }
            if (category)
                query.category = category;
            if (level)
                query.level = level;
            if (language)
                query.language = language;
            const skip = (page - 1) * limit;
            const totalCount = yield Course_1.Course.countDocuments(query);
            const totalPages = Math.ceil(totalCount / limit);
            const data = yield Course_1.Course.find(query)
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            return { data, totalPages, totalCount };
        });
    }
    findByTeacherId(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.find({ teacherId });
        });
    }
    findByIdAndTeacherId(courseId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.findOne({ _id: courseId, teacherId });
        });
    }
    getPremiumCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.find({});
        });
    }
    findAllCourses(query, sort, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec();
        });
    }
    countAllCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.countDocuments(query).exec();
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.findById(courseId).populate('teacherId', 'name email');
        });
    }
    findAll(_a) {
        return __awaiter(this, arguments, void 0, function* ({ skip, limit, search }) {
            const query = search ? { title: { $regex: search, $options: 'i' } } : {};
            const course = yield Course_1.Course.find(query).populate({ path: 'teacherId', select: ' name ' }).skip(skip).limit(limit).lean();
            return course;
        });
    }
    count(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = search ? { title: { $regex: search, $options: 'i' } } : {};
            return Course_1.Course.countDocuments(query);
        });
    }
    findUnverified() {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.find({ status: 'pending' }).lean();
        });
    }
    findById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.findById(courseId)
                .populate('teacherId', 'name email profilePicture about')
                .lean();
        });
    }
    updateStatus(courseId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.findByIdAndUpdate(courseId, updates, { new: true }).lean();
        });
    }
    incrementStudentCount(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Course_1.Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } }, { new: true });
        });
    }
    findRecommendedCourses(courseId, category, level, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.find({
                _id: { $ne: courseId },
                $or: [
                    { category },
                    { level }
                ],
                isPublished: true
            })
                .sort({ totalStudents: -1 })
                .limit(limit)
                .lean();
        });
    }
    editCourse(courseId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.Course.findByIdAndUpdate(courseId, { $set: updates }, { new: true });
        });
    }
};
exports.CourseRepository = CourseRepository;
exports.CourseRepository = CourseRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseRepository);
