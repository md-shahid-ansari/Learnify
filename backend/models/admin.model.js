import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const adminSchema = new mongoose.Schema({
    adminId: {
        type: Number,
        unique: true
    },
    adminName: {
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
    contactNumber: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    activityLog: [{
        action: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    resetPasswordToken: {
        type: String,
        default: null  // Token for password reset
    },
    resetPasswordExpireAt: {
        type: Date,
        default: null  // Expiration time for the reset token
    },
    verificationToken: {
        type: String,
        default: null  // Token for email verification
    },
    verificationExpireAt: {
        type: Date,
        default: null  // Expiration time for the verification token
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the adminSchema
adminSchema.plugin(AutoIncrement, { inc_field: 'adminId', start_seq: 1 });

export const Admin = mongoose.model('Admin', adminSchema);
