import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const mentorSchema = new mongoose.Schema({
    mentorId: {
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
        default: null  // URL for the mentor’s profile picture
    },
    skills: {
        type: [String],  // List of skills for the mentor
        default: []
    },
    bio: {
        type: String,
        default: null  // Short biography about the mentor
    },
    experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner'
    },
    availability: {
        type: String,  // Mentor’s availability for support sessions
        default: null
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

// Apply the auto-increment plugin to the mentorSchema
mentorSchema.plugin(AutoIncrement, { inc_field: 'mentorId', start_seq: 1 });

export const Mentor = mongoose.model('Mentor', mentorSchema);
