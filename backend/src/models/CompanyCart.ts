import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from './Course';

export interface ICompanyCartCourse {
    courseId: mongoose.Types.ObjectId | ICourse;
    accessType: 'seats' | 'unlimited';
    seats: number;
    price: number;
}

export interface ICompanyCart extends Document {
    userId: mongoose.Types.ObjectId;
    courses: ICompanyCartCourse[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema = new Schema<ICompanyCart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },

        courses: [
            {
                courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
                accessType: { type: String, enum: ['seats', 'unlimited'], default: 'seats' },
                seats: { type: Number, default: 1 },
                price: { type: Number, required: true },
            }
        ],
    },
    { timestamps: true }
);

export const CompanyCart = mongoose.model<ICompanyCart>('CompanyCart', CartSchema);
