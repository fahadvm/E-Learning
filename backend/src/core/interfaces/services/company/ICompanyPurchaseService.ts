import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { ICourse } from '../../../../models/Course';


export interface ICompanyPurchaseService {

  createCheckoutSession(
    courses: string [],
    companyId: string,
    amount: number
  ): Promise<{ url: string | null }>;


  verifyPayment(sessionId: string, companyId: string): Promise<{ success: boolean }>;


  getPurchasedCourses(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]>; 
  getMycoursesIdsById(companyId: string): Promise<string[] | null>;
}
