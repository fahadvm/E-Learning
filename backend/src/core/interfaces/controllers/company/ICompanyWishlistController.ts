import { Request, Response } from 'express';

export interface ICompanyWishlistController {
  add(req: Request, res: Response): Promise<void>;
  list(req: Request, res: Response): Promise<void>;
  remove(req: Request, res: Response): Promise<void>;
}
