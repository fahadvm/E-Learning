export interface ICourseResource {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;     
  originalName: string;  
  size: number;          
  createdAt: string;
}
