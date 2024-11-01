import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const lessonSchema = new mongoose.Schema({
    lessonId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Name of the lesson
    },
    description: {
        type: String,
        required: true  // Overview of the lesson’s content
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Topic model
        ref: 'Topic'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the lessonSchema
lessonSchema.plugin(AutoIncrement, { inc_field: 'lessonId', start_seq: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
