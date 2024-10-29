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
    course: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Course'
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Tutor'
    },
    earnedBy: [{
        type: mongoose.Schema.Types.ObjectId,  // List of student IDs who have earned the certification
        ref: 'Student'
    }],
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
