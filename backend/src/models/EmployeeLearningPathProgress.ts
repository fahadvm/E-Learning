import { Schema, model, Types, Document } from "mongoose";

export interface IEmployeeLearningPathProgress extends Document {
  employeeId: Types.ObjectId;
  learningPathId: Types.ObjectId;
  companyId: Types.ObjectId;

  currentCourseIndex: number;
  completedCourses: Types.ObjectId[];
  status: "active" | "paused" | "completed";
}

const EmployeeLearningPathProgressSchema = new Schema<IEmployeeLearningPathProgress>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    learningPathId: { type: Schema.Types.ObjectId, ref: "EmployeeLearningPath", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },

    currentCourseIndex: { type: Number, default: 0 },
    completedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
  },
  { timestamps: true }
);

export const EmployeeLearningPathProgress = model<IEmployeeLearningPathProgress>(
  "EmployeeLearningPathProgress",
  EmployeeLearningPathProgressSchema
);
