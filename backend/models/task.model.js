import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        unique: true
    },
    taskTitle: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true  // Detailed instructions for the task
    },
    assignedTo: {
        type: Number,  // The student responsible for the task
    },
    status: {
        type: String,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started'  // Task status
    },
    dueDate: {
        type: Date,
        
    },
    files: {
        type: String,  // URL or link to task-related documentation (preferably GitHub)
        default: null
    },
    comments: {
        type: String,  // Any additional instructions or comments from the mentor
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the taskSchema
taskSchema.plugin(AutoIncrement, { inc_field: 'taskId', start_seq: 1 });

export const Task = mongoose.model('Task', taskSchema);
