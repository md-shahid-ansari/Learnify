import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const leaderboardSchema = new mongoose.Schema({
    leaderboardId: {
        type: Number,
        unique: true
    },
    studentId: {
        type: Number,
        required: true  // The student being ranked
    },
    challengeId: {
        type: Number,  // The challenge related to the ranking (can be null if associated with a module)
        default: null
    },
    moduleId: {
        type: Number,  // The module related to the ranking (can be null if associated with a challenge)
        default: null
    },
    rank: {
        type: Number,  // The student’s ranking (1st, 2nd, etc.)
        required: true
    },
    points: {
        type: Number,  // Points or score achieved for the challenge or module
        required: true
    },
    badgesEarned: {
        type: [String],  // List of badges or achievements awarded to the student
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now  // Date when the leaderboard entry was created
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the leaderboardSchema
leaderboardSchema.plugin(AutoIncrement, { inc_field: 'leaderboardId', start_seq: 1 });

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
