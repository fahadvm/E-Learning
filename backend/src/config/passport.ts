// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { config } from "dotenv";
// // import { Student } from "../repositories/student/StudentAuthRepository";
// config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const userData = {
//           email: profile.emails?.[0].value,
//           username: profile.displayName,
//           googleId: profile.id,
//           profilePicture: profile.photos?.[0].value,
//           googleUser: true,
//         };

//         // Do your user creation/upsert logic here using services or repositories
//         const user = await yourUserService.googleLogin(userData);

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   // fetch user by id from DB
//   const user = await yourUserRepo.findById(id);
//   done(null, user);
// });
