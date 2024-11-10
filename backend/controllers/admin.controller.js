import { Admin } from '../models/admin.model.js';
import { Certificate } from '../models/certificate.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Course } from '../models/course.model.js';
import { Student } from '../models/student.model.js';
import { Tutor } from '../models/tutor.model.js';

import { deleteCourse } from './tutor.controller.js';


export const updateAdmin = async (req, res) => {
    const { _id, email, adminName, contactNumber } = req.body;
    // Validate request body
    if (!_id || !email || !adminName || !contactNumber) {
        return res.status(400).json({
            success: false,
            message: 'All fields (_id, email, adminName, contactNumber) are required.',
        });
    }

    try {
        // Find and update the Admin record
        const updatedAdmin = await Admin.findByIdAndUpdate(
            _id,
            { email, adminName, contactNumber },
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found. Update failed.',
            });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            admin: updatedAdmin,
        });
    } catch (error) {
        // Log and send error response
        console.error('Error updating Admin profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Could not update profile.',
        });
    }
};


export const getAllCertificates = async (req, res) => {
    try {
      // Fetch certificates with selective field population
      const certificates = await Certificate.find()
        .populate('course', 'title')  // Only populate necessary fields
        .populate('earnedBy', 'name')             // Example: student's name only
        .populate('tutor', 'name');               // Example: tutor's name only
  
      // Send response
      res.status(200).json({
        success: true,
        certificates,
      });
    } catch (error) {
      console.error(`Error fetching certificates:`, error);
      res.status(500).json({ error: "An error occurred while fetching certificates." });
    }
};

export const getAllCoursesWithoutAnyModule = async (req, res) => {
    try {
      // Fetch courses
      const courses = await Course.find()
      .populate('tutor'); 
  
      // Send response
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error) {
      console.error(`Error fetching courses:`, error);
      res.status(500).json({ error: "An error occurred while fetching courses." });
    }
};

export const getAllEnrollments = async (req, res) => {
    try {
      // Fetch enrollments with populated fields for courseId, tutorId, and studentId
      const enrollments = await Enrollment.find()
        .populate('courseId', 'title') // Specify fields you want from Course
        .populate('studentId', 'name'); // Specify fields you want from Student
  
      // Send response
      res.status(200).json({
        success: true,
        enrollments,
      });
    } catch (error) {
      console.error(`Error fetching enrollments:`, error);
      res.status(500).json({ error: "An error occurred while fetching enrollments." });
    }
};

export const getAllTutors = async (req, res) => {
    try {
      // Fetch tutors and populate their enrollment details
      const tutors = await Tutor.find();
  
      // Send response
      res.status(200).json({
        success: true,
        tutors,
      });
    } catch (error) {
      console.error(`Error fetching tutors:`, error);
      res.status(500).json({ error: "An error occurred while fetching tutors." });
    }
};

export const getAllStudents = async (req, res) => {
    try {
      // Fetch students and populate their enrollment details
      const students = await Student.find();
  
      // Send response
      res.status(200).json({
        success: true,
        students,
      });
    } catch (error) {
      console.error(`Error fetching students:`, error);
      res.status(500).json({ error: "An error occurred while fetching students." });
    }
};

export const getAllAdmin = async (req, res) => {
    try {
      // Fetch all admin users
      const admins = await Admin.find();
      
      // Send response
      res.status(200).json({
        success: true,
        admins,
      });
    } catch (error) {
      console.error(`Error fetching admins:`, error);
      res.status(500).json({ error: "An error occurred while fetching admins." });
    }
};
  

export const deleteBatch = async (req, res) => {
    const { type, id } = req.body;

    try {
        let deletedEntity;

        // Switch case to handle different entity types
        switch (type) {
            case 'admin':
                deletedEntity = await Admin.findByIdAndDelete(id);
                break;
            case 'certificate':
                deletedEntity = await Certificate.findByIdAndDelete(id);
                break;
            case 'enrollment':
                deletedEntity = await Enrollment.findByIdAndDelete(id);
                break;
            case 'course':
                // Add courseId to req.body using the existing id
                req.body.courseId = req.body.id;  // Assign courseId as req.body.id
                return deleteCourse(req, res);  // Pass the modified req.body to deleteCourse
            case 'student':
                deletedEntity = await Student.findByIdAndDelete(id);
                break;
            case 'tutor':
                deletedEntity = await Tutor.findByIdAndDelete(id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid type specified' });
        }

        // If no entity was found with the provided ID, send an error response
        if (!deletedEntity) {
            return res.status(404).json({ message: `${type} not found` });
        }

        return res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, deletedEntity });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
