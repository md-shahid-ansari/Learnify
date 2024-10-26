import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const learningPathSchema = new mongoose.Schema({
    learningPathId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Name of the learning path
    },
    description: {
        type: String,
        required: true  // Overview of the learning path
    },
    mentor: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to the mentor who created this path
        ref: 'Mentor',
        required: true
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,  // References to Course model
        ref: 'Course'
    }],
    certifications: [{
        type: mongoose.Schema.Types.ObjectId,  // References to Certification model
        ref: 'Certification'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the learningPathSchema
learningPathSchema.plugin(AutoIncrement, { inc_field: 'learningPathId', start_seq: 1 });

export const LearningPath = mongoose.model('LearningPath', learningPathSchema);
