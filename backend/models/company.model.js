import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const companySchema = new mongoose.Schema({
    companyId: {
        type: Number,
        unique: true
    },
    companyName: {
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
    industry: {
        type: String,
    },
    description: {
        type: String,
    },
    contactInfo: {
        email: {
            type: String,
        },
        contactNumber: {
            type: String,
        }
    },
    challengesPosted: {
        type: [Number],  // List of challenge IDs posted by the company
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
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

// Apply the auto-increment plugin to the companySchema
companySchema.plugin(AutoIncrement, { inc_field: 'companyId', start_seq: 1 });

export const Company = mongoose.model('Company', companySchema);
