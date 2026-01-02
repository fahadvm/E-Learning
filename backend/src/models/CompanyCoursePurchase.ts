import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyCoursePurchase extends Document {
    companyId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    seatsPurchased: number;
    seatsUsed: number;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyCoursePurchaseSchema = new Schema<ICompanyCoursePurchase>(
    {
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        seatsPurchased: { type: Number, required: true },
        seatsUsed: { type: Number, default: 0 },

    },
    { timestamps: true }
);

export default mongoose.model<ICompanyCoursePurchase>(
    'CompanyCoursePurchase',
    CompanyCoursePurchaseSchema
);
