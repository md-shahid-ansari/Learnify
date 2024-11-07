import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const studentSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String],  // List of skills for the student
        default: []
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    verificationToken: String,
    verificationExpireAt: Date
}, { timestamps: true });

// Apply the auto-increment plugin to the studentSchema
studentSchema.plugin(AutoIncrement, { inc_field: 'studentId', start_seq: 1 });

export const Student = mongoose.model('Student', studentSchema);
