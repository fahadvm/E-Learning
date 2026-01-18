import { IOrder } from '../../../../models/Order';
import { ICourse } from '../../../../models/Course';
import { ICourseProgress } from '../../../../models/Student';
import { IPurchasedCourseDTO, IStudentCourseDTO } from '../../../dtos/student/Student.course.Dto';

export interface IStudentPurchaseService {
    createOrder(studentId: string, courses: string[], amount: number, currency?: string): Promise<Partial<IOrder>>;
    verifyPayment(details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }, studentId: string): Promise<{ success: boolean }>;
    getPurchasedCourses(studentId: string): Promise<IOrder[] | ICourse[]>;
    getPurchasedCourseIds(studentId: string): Promise<string[]>
    getOrderDetails(studentId: string, orderId: string): Promise<IOrder>
    getPurchasedCourseDetails(courseId: string, studentId: string): Promise<{ course: IPurchasedCourseDTO; progress: ICourseProgress; recommended: IStudentCourseDTO[] }>
    getPurchaseHistory(studentId: string, page: number, limit: number): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        orders: IOrder[];
    }>;
}