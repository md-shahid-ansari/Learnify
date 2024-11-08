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


export const getEnrollments = async (req, res) => {
  const { studentId } = req.body;

  // Validate input
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required." });
  }

  try {
    // Fetch enrollments with selective population (excluding large GridFS files if applicable)
    const enrollments = await Enrollment.find({ studentId })
    .populate('courseId');

    // Send response
    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "An error occurred while fetching enrollments." });
  }
}


// Helper function to generate URLs for GridFS images
const URL = process.env.REACT_APP_BACKEND_URL;
const getImageUrl = (fileId) => `${URL}/api/auth/files/${fileId}`;

export const getCourse = async (req, res) => {
    const { courseId } = req.body;

    // Validate input
    if (!courseId) {
        return res.status(400).json({ error: "course Id is required." });
    }

    try {
        // Fetch courses with populated structure but without attempting to populate GridFS files
        const courses = await Course.find({ _id: courseId }).populate({
            path: 'modules',
            populate: [
                {
                    path: 'lessons',
                    populate: { path: 'topics' }
                },
                { path: 'quizzes' }
            ]
        });

        // Map through each course to attach image URLs
        const coursesWithImages = await Promise.all(courses.map(async (course) => {
            const modules = await Promise.all(course.modules.map(async (module) => {
                const lessons = await Promise.all(module.lessons.map(async (lesson) => {
                    const topics = await Promise.all(lesson.topics.map(async (topic) => {
                        // Attach GridFS image URLs for each image in topic.images
                        const imagesWithUrls = topic.images.map((image) => ({
                            ...image.toObject(),
                            previewUrl: getImageUrl(image.fileId)
                        }));
                        return { ...topic.toObject(), images: imagesWithUrls };
                    }));
                    return { ...lesson.toObject(), topics };
                }));
                return { ...module.toObject(), lessons };
            }));
            return { ...course.toObject(), modules };
        }));

        // Send the modified response with URLs included
        res.status(200).json({
            success: true,
            course: coursesWithImages,
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ error: "An error occurred while fetching course." });
    }
};