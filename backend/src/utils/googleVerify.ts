import { OAuth2Client } from 'google-auth-library';
import { throwError } from './ResANDError';
import { STATUS_CODES } from './HttpStatuscodes';
import { GooglePayLoad } from '../types/userTypes';

// Replace this with your actual Google Client ID from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';

const client = new OAuth2Client(CLIENT_ID);

export async function verifyGoogleIdToken(idToken: string): Promise<GooglePayLoad> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub || !payload.name) {
      throwError('Invalid Google token payload', STATUS_CODES.BAD_REQUEST);
    }

    return {
      email: payload.email,
      googleId: payload.sub,
      username: payload.name,
      image: payload.picture || '',
    };
  } catch (err) {
    console.error('Google ID token verification failed:', err);
    throwError('Failed to verify Google ID token', STATUS_CODES.UNAUTHORIZED);
  }
}
