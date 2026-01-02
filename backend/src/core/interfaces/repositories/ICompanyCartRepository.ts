import { ICompanyCart } from '../../../models/CompanyCart';

export interface ICompanyCartRepository {
  getCart(userId: string): Promise<ICompanyCart | null>;

  addToCart(
    userId: string,
    courseId: string,
    accessType: 'seats' | 'unlimited',
    seats: number,
    price: number
  ): Promise<ICompanyCart>;

  removeFromCart(userId: string, courseId: string): Promise<ICompanyCart | null>;

  clearCart(userId: string): Promise<ICompanyCart | null>;

  updateSeats(
    userId: string,
    courseId: string,
    seats: number
  ): Promise<ICompanyCart | null>;
}
