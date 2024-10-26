import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const mentorRequestSchema = new mongoose.Schema({
    requestId: {
        type: Number,
        unique: true
    },
    studentId: {
        type: Number,
        required: true  // The student requesting mentor support
    },
    mentorId: {
        type: Number,
        required: true  // The mentor assigned to handle the request
    },
    projectId: {
        type: Number,
    },
    challengeId: {
        type: Number,
    },
    requestStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'  // Status of the request
    },
    requestDetails: {
        type: String,
        required: true  // Explanation of the issue or guidance needed
    },
    response: {
        type: String,  // Mentor’s response and feedback
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now  // Date when the request was created
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the mentorRequestSchema
mentorRequestSchema.plugin(AutoIncrement, { inc_field: 'requestId', start_seq: 1 });

export const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);
