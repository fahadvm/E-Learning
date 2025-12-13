import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import http from 'http'; 
import { initSocket} from './config/socket';
import connectDb from './config/db';
import companyRoutes from './routes/companyRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentAuthRoutes';
import employeeRoutes from './routes/employeeRoutes';
import teacherRoutes from './routes/teacherAuthRoutes';
import sharedRoutes from './routes/sharedRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();
const app = express();
const server = http.createServer(app);
initSocket(server);
connectDb();




app.use(
  morgan('tiny', {
    stream: { write: (message: string) =>  logger.info(message.trim()) },
  })
);

app.use(
  session({ secret: 'your_secret', resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
  'https://devnext.online',
  'https://www.devnext.online',
  'https://api.devnext.online',
  /\.devtunnels\.ms$/,
];
app.use(
  cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/shared', sharedRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
   logger.http(`Server + Socket running on port ${PORT}`);
});
