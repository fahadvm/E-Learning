import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { ISharedController } from '../../core/interfaces/controllers/shared/ISharedController';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { refreshAccessToken, setTokensInCookies } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class SharedController implements ISharedController {
  constructor() { }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const tokens = refreshAccessToken(req.cookies.refreshToken);
    if (!tokens) throwError(MESSAGES.TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED);

    setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.TOKEN_REFRESHED, true);
  };

  uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) throwError(MESSAGES.FILE_REQUIRED, STATUS_CODES.BAD_REQUEST);

      const { uploadToCloudinary } = await import('../../utils/upload');
      const url = await uploadToCloudinary(req.file.buffer, 'chat-uploads', 'auto');

      sendResponse(res, STATUS_CODES.OK, MESSAGES.FILE_UPLOADED_SUCCESSFULLY, true, { url });
    } catch (error) {
      throwError(MESSAGES.FILE_UPLOAD_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  };

  getIceConfig = async (req: Request, res: Response): Promise<void> => {
    try {
      // Default to public STUN server
      const iceServers: any[] = [
        { urls: "stun:stun.l.google.com:19302" },
      ];

      // If TURN credentials are in environment variables, add them
      // This allows the user to easily add a TURN server effectively fixing the issue
      if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
        iceServers.push({
          urls: process.env.TURN_URL,
          username: process.env.TURN_USERNAME,
          credential: process.env.TURN_CREDENTIAL
        });
      }

      sendResponse(res, STATUS_CODES.OK, MESSAGES.ICE_CONFIG_FETCHED, true, iceServers);
    } catch (error) {
      throwError(MESSAGES.FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  };
}
