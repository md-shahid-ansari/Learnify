import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";  // Import the mongoose-sequence package

const AutoIncrement = AutoIncrementFactory(mongoose); // Initialize the auto-increment plugin

const EnrollmentSchema = new mongoose.Schema({
  enrollmentId:{
    type: Number,
    unique: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0 // Percentage of course completed
  },
  completedLessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson"
    }
  ],
  completedQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz"
    }
  ],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  certificateIssued: {
    type: Boolean,
    default: false
  }
});

// Apply the auto-increment plugin to the EnrollmentSchema
EnrollmentSchema.plugin(AutoIncrement, { inc_field: 'enrollmentId', start_seq: 1 }); // Using `enrollmentId` for this schema

export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
