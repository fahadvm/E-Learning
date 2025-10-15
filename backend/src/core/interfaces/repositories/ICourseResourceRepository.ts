import { ICourseResource } from "../../../models/CourseResource";

export interface ICourseResourceRepository {
  uploadResource(resourceData: Partial<ICourseResource>): Promise<ICourseResource>;
  getResourcesByCourse(courseId: string): Promise<ICourseResource[]>;
  deleteResource(resourceId: string): Promise<void>;
}
