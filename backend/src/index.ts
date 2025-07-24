import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDb from "./config/db";
import cookieParser from "cookie-parser";
import studentAuthRoutes from "./routes/studentAuthRoutes";
import companyAuthRoutes from "./routes/companyAuthRoutes"
import adminAuthRoutes from "./routes/adminAuthRoutes"
import "./config/passport"; 


dotenv.config();
const app = express();
app.use(session({ secret: "your_secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/auth/student", studentAuthRoutes);
app.use("/auth/company", companyAuthRoutes);
app.use("/auth/admin", adminAuthRoutes);
app.use(cookieParser());
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectDb();