import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const topicSchema = new mongoose.Schema({
    topicId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true  // Title of the topic
    },
    content: {
        type: String,
        required: true  // Detailed content or explanation of the topic
    },
    learningOutcomes: {
        type: [String],  // Key outcomes students should achieve after completing the topic
        default: []
    },
    references: {
        type: [String],  // External references or links for additional reading
        default: []
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,  // Array of references to files in GridFS (PDFs, images, etc.)
        ref: 'fs.files'  // GridFS collection for storing files
    }],
    video: {
        type: [String],  // Optional media (e.g., video URLs)
        default: []
    },
    duration: {
        type: Number,  // Estimated duration (in minutes) to complete the topic
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Apply the auto-increment plugin to the topicSchema
topicSchema.plugin(AutoIncrement, { inc_field: 'topicId', start_seq: 1 });

export const Topic = mongoose.model('Topic', topicSchema);
