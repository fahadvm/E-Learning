import { ICourse, ILesson, IModule } from '../../../models/Course';

export interface IEmployeeLessonDTO {
    _id?: string;
    title: string;
    description?: string;
    duration?: number;
}

export interface IEmployeeModuleDTO {
    _id?: string;
    title: string;
    description?: string;
    lessons: IEmployeeLessonDTO[];
}

export interface IEmployeeCourseDTO {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    level: string;
    category: string;
    language: string;
    coverImage?: string;
    totalDuration?: number;
    modules: IEmployeeModuleDTO[];
    createdAt: Date;
    updatedAt: Date;
}

// --- Full Access (Assigned Courses) ---

export interface IEmployeeFullLessonDTO extends IEmployeeLessonDTO {
    videoFile?: string;
    thumbnail?: string;
}

export interface IEmployeeFullModuleDTO {
    _id?: string;
    title: string;
    description?: string;
    lessons: IEmployeeFullLessonDTO[];
}

export interface IEmployeeFullCourseDTO extends Omit<IEmployeeCourseDTO, 'modules'> {
    modules: IEmployeeFullModuleDTO[];
}

// --- Mappers ---

export const EmployeeLessonDTO = (lesson: ILesson): IEmployeeLessonDTO => ({
    _id: lesson._id?.toString(),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
});

export const EmployeeModuleDTO = (module: IModule): IEmployeeModuleDTO => ({
    _id: module._id?.toString(),
    title: module.title,
    description: module.description,
    lessons: module.lessons?.map(EmployeeLessonDTO) || [],
});

export const EmployeeCourseDTO = (course: ICourse): IEmployeeCourseDTO => ({
    _id: course._id.toString(),
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    level: course.level,
    category: course.category,
    language: course.language,
    coverImage: course.coverImage,
    totalDuration: course.totalDuration,
    modules: course.modules?.map(EmployeeModuleDTO) || [],
    createdAt: course.createdAt!,
    updatedAt: course.updatedAt!,
});

export const EmployeeFullLessonDTO = (lesson: ILesson): IEmployeeFullLessonDTO => ({
    ...EmployeeLessonDTO(lesson),
    videoFile: lesson.videoFile,
    thumbnail: lesson.thumbnail,
});

export const EmployeeFullModuleDTO = (module: IModule): IEmployeeFullModuleDTO => ({
    _id: module._id?.toString(),
    title: module.title,
    description: module.description,
    lessons: module.lessons?.map(EmployeeFullLessonDTO) || [],
});

export const EmployeeFullCourseDTO = (course: ICourse): IEmployeeFullCourseDTO => ({
    ...EmployeeCourseDTO(course),
    modules: course.modules?.map(EmployeeFullModuleDTO) || [],
});
