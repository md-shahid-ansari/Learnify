import {Student} from '../models/student.model.js';
import {Course} from '../models/course.model.js';
import {Enrollment} from '../models/enrollment.model.js';

export const updateStudent = async (req, res) => {
    const { _id, email, name, skills } = req.body;
    // Validate request body
    if (!_id || !email || !name || !skills) {
        return res.status(400).json({
            success: false,
            message: 'All fields (_id, email, name, skills) are required.',
        });
    }

    try {
        // Find and update the Student record
        const updatedStudent = await Student.findByIdAndUpdate(
            _id,
            { email, name, skills },
            { new: true } // Return the updated document
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found. Update failed.',
            });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            student: updatedStudent,
        });
    } catch (error) {
        // Log and send error response
        console.error('Error updating student profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Could not update profile.',
        });
    }
};


export const enroll = async (req, res) => {
    const { studentId, courseId } = req.body;
  
    // Validate request body
    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both studentId and courseId are required.',
      });
    }
  
    try {
      // Find the student and course
      const student = await Student.findById(studentId);
      const course = await Course.findById(courseId);
  
      if (!student || !course) {
        return res.status(404).json({
          success: false,
          message: 'Student or course not found.',
        });
      }
  
      // Check if student is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({
        studentId: studentId,
        courseId: courseId,
      });
  
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'Student is already enrolled in this course.',
        });
      }
  
      // Create a new enrollment
      const newEnrollment = new Enrollment({
        studentId: studentId,
        courseId: courseId,
      });
  
      // Save the enrollment
      await newEnrollment.save();
  
      // Return success response
      return res.status(201).json({
        success: true,
        message: 'Student enrolled in course successfully.',
        enrollment: newEnrollment, // Optionally include the enrollment data
      });
  
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error enrolling student:', error);
  
      // Return internal server error response
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message, // Optionally include error details for easier debugging
      });
    }
};
  