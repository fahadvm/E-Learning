import mongoose from 'mongoose';
import logger from '../utils/logger';
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('db connected succesfully');
    } catch (error) {
        console.error(error);
    }

};
export default connectDb;