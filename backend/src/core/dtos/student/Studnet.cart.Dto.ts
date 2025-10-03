import { ICourse } from '../../../models/Course';

export const studentCartDto = (courses: ICourse[], total: number): IStudentCartDTO => ({
  courses: courses.map((course) => ({
    id: course._id.toString(),
    title: course.title,
    price: course.price ? Number(course.price) : 0,
    coverImage: course.coverImage,
    teacherId: course.teacherId?.toString(),
  })),
  total,
});

export interface IStudentCartDTO {
  courses: {
    id: string;
    title: string;
    price: number;
    coverImage?: string;
    teacherId?: string;
  }[];
  total: number;
}
