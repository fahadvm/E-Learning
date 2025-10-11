// src/controllers/shared/shared.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { refreshAccessToken, setTokensInCookies } from "../../utils/JWTtoken";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class SharedController implements ISharedController {

    constructor() { }

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        const tokens = refreshAccessToken(req.cookies.refreshToken);
        if (!tokens) {
            throwError(MESSAGES.TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED);
        }
        setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
        sendResponse(res, STATUS_CODES.OK,MESSAGES.TOKEN_REFRESHED, true);
 
    }
}
