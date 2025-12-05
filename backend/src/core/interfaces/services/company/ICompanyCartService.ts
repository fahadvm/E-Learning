// interfaces/services/ICartService.ts
import { ICompanyCart, ICompanyCartCourse } from '../../../../models/CompanyCart';

export interface ICompanyCartService {
  getCart(userId: string): Promise<{ courses: ICompanyCartCourse[], total: number }>;
  addToCart(userId: string, courseId: string, accessType: "seats" | "unlimited", seats: number): Promise<ICompanyCart>;
  removeFromCart(userId: string, courseId: string): Promise<ICompanyCart | null>;
  clearCart(userId: string): Promise<ICompanyCart | null>;
  updateSeat(
    companyId: string,
    courseId: string,
    seats: number,
  ): Promise<ICompanyCart>;
}
