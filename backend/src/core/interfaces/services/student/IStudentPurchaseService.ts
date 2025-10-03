import { IOrder } from "../../../../models/Order";
import { ICourse } from "../../../../models/Course";

export interface IStudentPurchaseService {
    createOrder(studentId: string, courses: string[], amount: number, currency?: string): Promise<Partial<IOrder>>;
    verifyPayment(details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },studentId:string): Promise<{ success: boolean }>;
    getPurchasedCourses(studentId: string): Promise<IOrder[] |ICourse[]>;
    getPurchasedCourseDetails(courseId: string): Promise<ICourse>
}
