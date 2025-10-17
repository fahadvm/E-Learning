export interface IStudentAiTutorService {
  
  getCourseAnswer(studentId: string, courseId: string, prompt: string): Promise<string>;
}
