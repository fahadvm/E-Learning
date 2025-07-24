export const googleConfig = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  CALLBACK_URL: "http://localhost:8000/auth/google/callback",
};
