// services/studentAiTutorService.ts
import { inject, injectable } from 'inversify';
import { IStudentAiTutorService } from '../../core/interfaces/services/shared/IAiService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { TYPES } from '../../core/di/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../utils/logger';

@injectable()
export class StudentAiTutorService implements IStudentAiTutorService {
    private genAI: GoogleGenerativeAI;

    constructor(
        @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository
    ) {
        const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBp6N0JKRr2XR0PQgVR6XwfyYrDinr4LdY';
        if (!apiKey) throw new Error('Missing Google API key');
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async getCourseAnswer(studentId: string, courseId: string, prompt: string) {

        const course = await this._courseRepo.findById(courseId);
        if (!course) throw new Error('Course not found');

        const systemMessage = `
You are an AI Study Assistant. Answer student questions based on the course: ${course.title}.
Description: ${course.description || 'No description'}
Modules: ${course.modules?.map((m) => m.description).join(', ') || 'No modules'}
    `;

        const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        logger.debug(`prompt" : ${systemMessage}\n\nUser: ${prompt}`);

        const result = await model.generateContent(`${systemMessage}\n\nUser: ${prompt}`);
        const response = await result.response;

        return response.text() || 'Sorry, I could not answer that.';
    }
}
