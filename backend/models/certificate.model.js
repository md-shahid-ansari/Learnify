import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Name of the certificate
    },
    description: {
        type: String,
        required: true  // Overview of the certificate
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Course'
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Tutor'
    },
    earnedBy: {
        type: mongoose.Schema.Types.ObjectId,  // List of student IDs who have earned the certificate
        ref: 'Student'
    },
    dateEarned: {
        type: Date,  // Date when the certificate was awarded
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the certificateSchema
certificateSchema.plugin(AutoIncrement, { inc_field: 'certificateId', start_seq: 1 });

export const Certificate = mongoose.model('Certificate', certificateSchema);
