export interface IStudentAiTutorService {
  
  getCourseAnswer( courseId: string, prompt: string): Promise<string>;
}
