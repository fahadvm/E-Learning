// import { Request, Response } from "express";
// import {
//   handleControllerError,
//   sendResponse,
// } from "../../utils/ResANDError";
// // import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";
// import { refreshAccessToken, setTokensInCookies } from "../../utils/JWTtoken";

// export class SharedController implements ISharedController {

//   async refeshToken(req: Request, res: Response): Promise<void> {
//     try {
//       const tokens = refreshAccessToken(req.cookies.refreshToken);

//       if (!tokens) {
//         sendResponse(
//           res,
//           StatusCode.UNAUTHORIZED,
//           Messages.SHARED.INVALID_TOKEN,
//           false
//         );
//         return;
//       }
//       setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
//       sendResponse(res, StatusCode.OK, Messages.SHARED.TOKENS_REFRESHED, true);
//       return;
//     } catch (error) {
//       handleControllerError(res, error, StatusCode.UNAUTHORIZED);
//       return;
//     }
//   }

// }