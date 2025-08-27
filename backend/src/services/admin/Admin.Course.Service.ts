import { inject, injectable } from "inversify";
import { IAdminCourseService } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICourseRepository } from "../../core/interfaces/repositories/ICourseRepository";
import { TYPES } from "../../core/di/types";
import { IAdminCourseDTO,AdminCourseDTO, PaginatedCourseDTO } from "../../core/dtos/admin/Admin.course.Dto";

@injectable()
export class AdminCourseService implements IAdminCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository
  ) {}

  async getAllCourses(page: number, limit: number, search?: string): Promise<PaginatedCourseDTO> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this._courseRepo.findAll({ skip, limit, search }),
      this._courseRepo.count(search),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data: data.map(AdminCourseDTO), total ,totalPages };
  }

  async getUnverifiedCourses(): Promise<IAdminCourseDTO[]> {
    const courses = await this._courseRepo.findUnverified();
    return courses.map(AdminCourseDTO);
  }

  async getCourseById(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.findById(courseId);
    return course ? AdminCourseDTO(course) : null;
  }

  async verifyCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { status: "verified" });
    return course ? AdminCourseDTO(course) : null;
  }

  async rejectCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { status: "rejected" });
    return course ? AdminCourseDTO(course) : null;
  }

  async blockCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { isBlocked: true });
    return course ? AdminCourseDTO(course) : null;
  }

  async unblockCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { isBlocked: false });
    return course ? AdminCourseDTO(course) : null;
  }
}
