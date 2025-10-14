import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";
import { IStudentRepository } from "../core/interfaces/repositories/IStudentRepository"; 
import { Student, IStudent, ICourseProgress } from "../models/Student";
import { Course } from "../models/Course";
import { throwError } from "../utils/ResANDError";
import { MESSAGES } from "../utils/ResponseMessages";
import { STATUS_CODES } from "../utils/HttpStatuscodes";

@injectable()
export class StudentRepository implements IStudentRepository {
  async create(student: Partial<IStudent>): Promise<IStudent> {
    return Student.create(student);
  }

  async findByEmail(email: string): Promise<IStudent | null> {
    return Student.findOne({ email }).lean().exec();
  }

  async findByGoogleId(googleId: string): Promise<IStudent | null> {
    return Student.findOne({ googleId }).lean().exec();
  }

  async findAll(skip: number, limit: number, search?: string): Promise<IStudent[]> {
    const filter: FilterQuery<IStudent> = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    return Student.find(filter).skip(skip).limit(limit).lean().exec();
  }

  async findOne(filter: FilterQuery<IStudent>): Promise<IStudent | null> {
    return Student.findOne(filter).lean().exec();
  }

  async findById(id: string): Promise<IStudent | null> {
    return Student.findById(id).lean().exec();
  }

  async update(id: string, data: Partial<IStudent>): Promise<IStudent> {
    const updated = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    )
      .lean()
      .exec();

    if (!updated) {
      throw new Error("Student not found for update.");
    }
    return updated;
  }

  async updateByEmail(email: string, updateData: Partial<IStudent>): Promise<IStudent | null> {
    return Student.findOneAndUpdate({ email }, { $set: updateData }, { new: true })
      .lean()
      .exec();
  }

  async updateProfile(studentId: string, profileData: Partial<IStudent>): Promise<IStudent | null> {
    return Student.findByIdAndUpdate(studentId, profileData, { new: true }).lean().exec();
  }

  async count(search?: string): Promise<number> {
    const filter: FilterQuery<IStudent> = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    return Student.countDocuments(filter).exec();
  }

  /**
   * Updates student's progress in a course when a lesson is completed.
   * Calculates and updates progress percentage.
   */
  async updateStudentProgress(studentId: string, courseId: string, lessonId: string): Promise<ICourseProgress> {
    if (!Types.ObjectId.isValid(studentId) || !Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid ID');
    }

    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    
    // Use atomic update to prevent concurrency issues
    let progress = student.coursesProgress.find((p) => p.courseId.toString() === courseId);

    if (!progress) {
      progress = {
        courseId: new Types.ObjectId(courseId),
        completedLessons: [],
        completedModules: [],
        percentage: 0,
        lastVisitedLesson: undefined,
      };
      student.coursesProgress.push(progress);
    }

    // Add lesson to completedLessons if not already present
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Update lastVisitedLesson
    progress.lastVisitedLesson = lessonId;

    // Calculate total lessons and completed lessons
    const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    progress.percentage = Math.min((completedLessons / totalLessons) * 100, 100);

    // Check and update completedModules
    const completedModuleIds: string[] = [];
    for (const module of course.modules) {
      const moduleLessons = module.lessons.map((l) => l._id.toString());
      if (moduleLessons.every((lessonId) => progress.completedLessons.includes(lessonId))) {
        const moduleId = module._id.toString();
        if (!progress.completedModules.includes(moduleId)) {
          completedModuleIds.push(moduleId);
        }
      }
    }
    progress.completedModules = completedModuleIds;

    // Save with optimistic concurrency control
    await student.save({ validateBeforeSave: true });
    return progress;
  }



  async getOrCreateCourseProgress(
    studentId: string,
    courseId: string
  ): Promise<ICourseProgress> {
    const student = await Student.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Find existing progress
    let progress = student.coursesProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    // If not exists, create and save
    if (!progress) {
      progress = {
        courseId: new Types.ObjectId(courseId),
        completedLessons: [],
        completedModules: [],
        percentage: 0,
        lastVisitedLesson: undefined,
      };
      student.coursesProgress.push(progress);
      await student.save();
    }

    return progress;
  }
}
