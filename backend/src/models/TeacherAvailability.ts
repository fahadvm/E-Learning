import { Schema, model, Document } from "mongoose"

export interface ITimeSlot {
  start: string
  end: string   
}

export interface IDayAvailability {
  day: string 
  enabled: boolean
  slots: ITimeSlot[]
}

export interface ITeacherAvailability extends Document {
  teacherId: Schema.Types.ObjectId
  week: IDayAvailability[]
  createdAt: Date
  updatedAt: Date
}

const TimeSlotSchema = new Schema<ITimeSlot>({
  start: { type: String, required: true },
  end: { type: String, required: true },
})

const DayAvailabilitySchema = new Schema<IDayAvailability>({
  day: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  slots: { type: [TimeSlotSchema], default: [] },
})

const TeacherAvailabilitySchema = new Schema<ITeacherAvailability>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true, unique: true },
    week: { type: [DayAvailabilitySchema], required: true },
  },
  { timestamps: true }
)

export const TeacherAvailability = model<ITeacherAvailability>("TeacherAvailability",TeacherAvailabilitySchema)
