"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = verifyGoogleIdToken;
const google_auth_library_1 = require("google-auth-library");
const ResANDError_1 = require("./ResANDError");
const HttpStatuscodes_1 = require("./HttpStatuscodes");
// Replace this with your actual Google Client ID from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const client = new google_auth_library_1.OAuth2Client(CLIENT_ID);
function verifyGoogleIdToken(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ticket = yield client.verifyIdToken({
                idToken,
                audience: CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email || !payload.sub || !payload.name) {
                (0, ResANDError_1.throwError)('Invalid Google token payload', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            return {
                email: payload.email,
                googleId: payload.sub,
                username: payload.name,
                image: payload.picture || '',
            };
        }
        catch (err) {
            logger.err('Google ID token verification failed:', err);
            (0, ResANDError_1.throwError)('Failed to verify Google ID token', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        }
    });
}
