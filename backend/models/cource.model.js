import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const courseSchema = new mongoose.Schema({
    courseId: {
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
    instructor: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to the mentor (or instructor)
        ref: 'User',
        required: true
    }],
    modules: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Module model
        ref: 'Module'
    }]
}, { timestamps: true });

// Apply auto-increment plugin to Course schema
courseSchema.plugin(AutoIncrement, { inc_field: 'courseId', start_seq: 1 });

export const Course = mongoose.model('Course', courseSchema);
