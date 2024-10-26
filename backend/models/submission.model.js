import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const submissionSchema = new mongoose.Schema({
    submissionId: {
        type: Number,
        unique: true
    },
    studentId: {
        type: Number,
        required: true  // The student who made the submission
    },
    challengeId: {
        type: Number,  // The related challenge ID (can be null if associated with a project)
        default: null
    },
    projectId: {
        type: Number,  // The related project ID (can be null if associated with a challenge)
        default: null
    },
    taskId: {
        type: Number,  // The related task ID (can be null if associated with a challenge)
        default: null
    },
    gitHubRepoURL: {
        type: String,
        required: true  // The GitHub repository link where the student’s code is hosted
    },
    submissionDate: {
        type: Date,
        default: Date.now  // The date the submission was made
    },
    status: {
        type: String,
        enum: ['pending review', 'approved', 'rejected'],
        default: 'pending review'  // Status of the submission
    },
    documentationLink: {
        type: String,  // Link to any documentation hosted on GitHub Pages or other external sources
        default: null
    },
    feedback: {
        type: String,  // Comments or feedback from the reviewing mentor or company
        default: null
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the submissionSchema
submissionSchema.plugin(AutoIncrement, { inc_field: 'submissionId', start_seq: 1 });

export const Submission = mongoose.model('Submission', submissionSchema);
