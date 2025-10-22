"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherAvailability = void 0;
const mongoose_1 = require("mongoose");
const TimeSlotSchema = new mongoose_1.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
});
const DayAvailabilitySchema = new mongoose_1.Schema({
    day: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    slots: { type: [TimeSlotSchema], default: [] },
});
const TeacherAvailabilitySchema = new mongoose_1.Schema({
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', required: true, unique: true },
    week: { type: [DayAvailabilitySchema], required: true },
}, { timestamps: true });
exports.TeacherAvailability = (0, mongoose_1.model)('TeacherAvailability', TeacherAvailabilitySchema);
