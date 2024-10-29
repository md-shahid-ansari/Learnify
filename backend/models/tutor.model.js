import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const tutorSchema = new mongoose.Schema({
    tutorId: {
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
    profilePicture: {
        type: String,
        default: null  // URL for the tutor’s profile picture
    },
    skills: {
        type: [String],  // List of skills for the tutor
        default: []
    },
    bio: {
        type: String,
        default: null  // Short biography about the tutor
    },
    experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner'
    },
    availability: {
        type: String,  // Tutor’s availability for support sessions
        default: null
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'  // Reference to the Course schema
    }],
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

// Apply the auto-increment plugin to the tutorSchema
tutorSchema.plugin(AutoIncrement, { inc_field: 'tutorId', start_seq: 1 });

export const Tutor = mongoose.model('Tutor', tutorSchema);
