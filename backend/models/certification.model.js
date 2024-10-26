import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const certificationSchema = new mongoose.Schema({
    certificationId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Name of the certification
    },
    description: {
        type: String,
        required: true  // Overview of the certification
    },
    issuingOrganization: {
        type: String,
        required: true  // The organization endorsing the certification
    },
    requirements: {
        type: String,  // Requirements for earning the certification
        required: true
    },
    earnedBy: {
        type: [Number],  // List of student IDs who have earned the certification
        default: []
    },
    dateEarned: {
        type: Date,  // Date when the certification was awarded
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the certificationSchema
certificationSchema.plugin(AutoIncrement, { inc_field: 'certificationId', start_seq: 1 });

export const Certification = mongoose.model('Certification', certificationSchema);
