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



// Add lesson to completedLessons
export const addLesson = async (req, res) => {
    const { lessonId, enrollmentId , totalLessonAndQuiz } = req.body;

    try {
        // Find enrollment by ID
        const enrollment = await Enrollment.findById(enrollmentId);

        // Check if the lesson is already in completedLessons
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            enrollment.progress = calculateProgress(enrollment , totalLessonAndQuiz); // Update progress
            await enrollment.save();

            return res.status(200).json({ success: true, message: "Lesson marked as completed", enrollment });
        } else {
            return res.status(200).json({ success: true, message: "Lesson already completed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Add quiz to completedQuizzes
export const addQuiz = async (req, res) => {
    const { quizId, enrollmentId , totalLessonAndQuiz } = req.body;

    try {
        // Find enrollment by ID
        const enrollment = await Enrollment.findById(enrollmentId);

        // Check if the quiz is already in completedQuizzes
        if (!enrollment.completedQuizzes.includes(quizId)) {
            enrollment.completedQuizzes.push(quizId);
            enrollment.progress = calculateProgress(enrollment, totalLessonAndQuiz); // Update progress
            await enrollment.save();

            return res.status(200).json({ success: true, message: "Quiz marked as completed", enrollment });
        } else {
            return res.status(200).json({ success: true, message: "Quiz already completed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Helper function to calculate course progress based on completed lessons and quizzes
const calculateProgress = (enrollment , totalLessonAndQuiz) => {
    const totalItems = enrollment.completedLessons.length + enrollment.completedQuizzes.length; // Adjust if needed
    const progress = (totalItems / totalLessonAndQuiz) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
};


export const getEnrollment = async (req, res) => {
    const { enrollmentId } = req.body;
  
    // Validate input
    if (!enrollmentId) {
      return res.status(400).json({ error: "enrollment ID is required." });
    }
  
    try {
      // Fetch enrollments with selective population (excluding large GridFS files if applicable)
      const enrollment = await Enrollment.findById(enrollmentId)
      .populate('courseId');
  
      // Send response
      res.status(200).json({
        success: true,
        enrollment,
      });
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      res.status(500).json({ error: "An error occurred while fetching enrollment." });
    }
  }