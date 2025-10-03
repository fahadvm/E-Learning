import { Request, Response } from 'express';

export interface IStudentCartController {
  getCart(req: Request, res: Response): Promise<void>;
  addToCart(req: Request, res: Response): Promise<void>;
  removeFromCart(req: Request, res: Response): Promise<void>;
  clearCart(req: Request, res: Response): Promise<void>;
}
