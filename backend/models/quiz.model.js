import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const quizSchema = new mongoose.Schema({
    quizId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Title of the quiz
    },
    description: {
        type: String,  // Brief overview of the quiz
        default: ""
    },
    questions: [{
        questionText: {
            type: String,
            required: true  // The text of the question
        },
        questionType: {
            type: String,  // Type of question: e.g., 'multiple-choice', 'true/false', 'short-answer'
            enum: ['multiple-choice', 'true/false', 'short-answer'],
            required: true
        },
        options: {
            type: [String],  // Options for multiple-choice questions
            default: []  // Leave empty for true/false or short-answer types
        },
        correctAnswer: {
            type: String,  // The correct answer for the question
            required: true
        }
    }],
    duration: {
        type: Number,  // Estimated time (in minutes) to complete the quiz
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the quizSchema
quizSchema.plugin(AutoIncrement, { inc_field: 'quizId', start_seq: 1 });

export const Quiz = mongoose.model('Quiz', quizSchema);
