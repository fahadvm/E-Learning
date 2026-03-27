import { ICompanyOrder } from '../../../../models/CompanyOrder';



export interface ICompanyPurchaseService {

  createCheckoutSession(companyId: string): Promise<{ url: string | null }>;


  verifyPayment(sessionId: string, companyId: string, failureReason?: string): Promise<{ success: boolean; amount?: number; order?: ICompanyOrder | null; message?: string }>;


  getPurchasedCourses(companyId: string): Promise<ICompanyOrder[]>;
  getMycoursesIdsById(companyId: string): Promise<string[] | null>;
}
