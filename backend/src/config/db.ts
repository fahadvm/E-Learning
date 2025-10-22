import mongoose from 'mongoose';
import logger from '../utils/logger';
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        logger.http('db connected succesfully');
    } catch (error) {
        logger.error(error);
    }

};
export default connectDb;