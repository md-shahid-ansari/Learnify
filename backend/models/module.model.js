import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const moduleSchema = new mongoose.Schema({
    moduleId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Name of the module
    },
    description: {
        type: String,
        required: true  // Overview of the module’s content and learning objectives
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the mentor (User)
        ref: 'Mentor',
        required: true
    },
    skillsEarned: {
        type: [String],  // List of skills students will gain after completing the module
        default: []
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Topic model
        ref: 'Topic'
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Quiz model
        ref: 'Quiz'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the moduleSchema
moduleSchema.plugin(AutoIncrement, { inc_field: 'moduleId', start_seq: 1 });

export const Module = mongoose.model('Module', moduleSchema);
