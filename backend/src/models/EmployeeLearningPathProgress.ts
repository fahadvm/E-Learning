import { Schema, model, Types, Document } from 'mongoose';

export interface IEmployeeLearningPathProgress extends Document {
    employeeId: Types.ObjectId;
    learningPathId: Types.ObjectId;
    companyId: Types.ObjectId;

    currentCourse: {
        index: number;
        courseId: Types.ObjectId;
        percentage: number;
    };

    completedCourses: Types.ObjectId[];
    percentage: number;
    status: 'active' | 'paused' | 'completed';
}


const EmployeeLearningPathProgressSchema = new Schema<IEmployeeLearningPathProgress>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
        learningPathId: { type: Schema.Types.ObjectId, ref: 'EmployeeLearningPath', required: true },
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },

        currentCourse: {
            index: { type: Number, default: 0 },
            courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
            percentage: { type: Number, default: 0 }
        },

        completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],

        percentage: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    },
    { timestamps: true }
);

export const EmployeeLearningPathProgress = model<IEmployeeLearningPathProgress>(
    'EmployeeLearningPathProgress',
    EmployeeLearningPathProgressSchema
);