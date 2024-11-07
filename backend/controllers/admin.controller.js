import {Admin} from '../models/admin.model.js';

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
