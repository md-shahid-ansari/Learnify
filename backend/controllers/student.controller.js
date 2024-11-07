import {Student} from '../models/student.model.js';

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
