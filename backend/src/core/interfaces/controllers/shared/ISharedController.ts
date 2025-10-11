import { Request, Response } from 'express';

export interface ISharedController {
    refreshToken(req: Request, res: Response): Promise<void>
}
