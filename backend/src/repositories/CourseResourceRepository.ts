// src/infrastructure/repositories/CourseResourceRepository.ts
import { injectable } from "inversify";
import { ICourseResourceRepository } from "../core/interfaces/repositories/ICourseResourceRepository";
import { CourseResource, ICourseResource } from "../models/CourseResource";

@injectable()
export class CourseResourceRepository implements ICourseResourceRepository {
  async uploadResource(resourceData: Partial<ICourseResource>): Promise<ICourseResource> {
    const resource = new CourseResource(resourceData);
    return resource.save();
  }

  async getResourcesByCourse(courseId: string): Promise<ICourseResource[]> {
    return CourseResource.find({ courseId }).sort({ createdAt: -1 });
  }

  async deleteResource(resourceId: string): Promise<void> {
    await CourseResource.findByIdAndDelete(resourceId);
  }

  
}
