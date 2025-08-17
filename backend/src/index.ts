import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import logger from './utils/logger';
import passport from 'passport';
import connectDb from './config/db';
import cookieParser from 'cookie-parser';
import companyRoutes from './routes/companyRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentAuthRoutes';
// import employeeRoutes from './routes/employeeRoutes'
import teacherRoutes from './routes/teacherAuthRoutes';
import { errorHandler } from './middleware/errorHandler';
import './config/passport'; 


dotenv.config();
const app = express();

app.use(
    morgan('tiny', {
      stream: {
        write: (message:string) => logger.info(message.trim())
      }
    })
  );


app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/company', companyRoutes);
app.use('/admin', adminRoutes);
app.use('/student',studentRoutes);
app.use('/teacher',teacherRoutes);
// app.use("/employee", employeeRoutes);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectDb();