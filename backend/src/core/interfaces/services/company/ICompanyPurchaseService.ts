import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { ICourse } from '../../../../models/Course';


export interface ICompanyPurchaseService {

  createCheckoutSession(companyId: string): Promise<{ url: string | null }>;


  verifyPayment(sessionId: string, companyId: string): Promise<{ success: boolean; amount?: number; order?: ICompanyOrder | null }>;


  getPurchasedCourses(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]>;
  getMycoursesIdsById(companyId: string): Promise<string[] | null>;
}
