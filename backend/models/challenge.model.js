import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const challengeSchema = new mongoose.Schema({
    challengeId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: {
        type: Number,  // The company that posted the challenge
        required: true
    },
    skillsRequired: {
        type: [String],  // List of skills required for the challenge
        default: []
    },
    duration: {
        type: String,  // Expected duration of the challenge or internship
        required: true
    },
    submissionDeadline: {
        type: Date,
        required: true  // The date when the challenge needs to be completed
    },
    rewardRecognition: {
        type: String,
        default: null  // Possible reward, certification, or recognition for completing the challenge
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    submissions: {
        type: [{  // List of student submissions using GitHub links
            studentId: Number,
            githubRepoURL: String
        }],
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the challengeSchema
challengeSchema.plugin(AutoIncrement, { inc_field: 'challengeId', start_seq: 1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);
