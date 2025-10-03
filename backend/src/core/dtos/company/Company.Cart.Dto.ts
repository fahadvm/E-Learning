import { ICourse } from '../../../models/Course';

export const companyCartDto = (courses: ICourse[], total: number): ICompanyCartDTO => ({
  courses: courses.map((course) => ({
    id: course._id.toString(),
    title: course.title,
    price: course.price ? Number(course.price) : 0,
    coverImage: course.coverImage,
    teacherId: course.teacherId?.toString(),
  })),
  total,
});

export interface ICompanyCartDTO {
  courses: {
    id: string;
    title: string;
    price: number;
    coverImage?: string;
    teacherId?: string;
  }[];
  total: number;
}
