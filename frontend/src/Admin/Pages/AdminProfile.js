import React, { useEffect, useState } from 'react';
import { IsAdminSessionLive } from '../utils/IsAdminSessionLive';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const AdminProfileSettings = () => {
    const [admin, setAdmin] = useState({
        _id: '',
        adminName: 'Alex Smith',
        email: 'alex.smith@example.com',
        contactNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [loadingForgot, setLoadingForgot] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated, adminData } = await IsAdminSessionLive();

            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
            if (adminData) {
                setAdmin(adminData);
            }
            setLoading(false);
        };

        authenticate();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
        }));
    };

    const handlePasswordResetRequest = async () => {
        setLoadingForgot(true);
        try {
            const response = await axios.post(`${URL}/api/auth/admin-forgot`, {
                email: admin.email
            });

            if (!response.data.success) {
                showErrorToast(response.data.message || 'Reset link failed to send.');
            } else {
                showSuccessToast(response.data.message || 'Reset link sent successfully.');
            }
        } catch (err) {
            if (err.response) {
                showErrorToast(err.response.data.message || 'Something went wrong.');
            } else {
                showErrorToast('Server is not responding.');
            }
        } finally {
            setLoadingForgot(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);

        try {
            const response = await axios.post(`${URL}/api/auth/admin-update`, {
                _id: admin._id,
                email: admin.email,
                adminName: admin.adminName,
                contactNumber: admin.contactNumber
            });

            if (!response.data.success) {
                showErrorToast(response.data.message || 'Profile update failed.');
            } else {
                showSuccessToast(response.data.message || 'Profile updated successfully.');
            }
        } catch (err) {
            if (err.response) {
                showErrorToast(err.response.data.message || 'Something went wrong.');
            } else {
                showErrorToast('Server is not responding.');
            }
        } finally {
            setLoadingUpdate(false);
        }
    };

    if (loading) 
        return (
            <p className="text-center text-indigo-500 text-xl font-semibold animate-pulse mt-10">
                Loading...
            </p>
        );

    return (
        <div className="flex flex-col items-center py-12 px-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Profile Settings</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                
                {/* Full Name */}
                <div className="mb-6">
                    <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        id="adminName" 
                        name="adminName"
                        value={admin.adminName} 
                        onChange={handleChange} 
                        required 
                        className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Email (Unchangeable) */}
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={admin.email} 
                        disabled 
                        className="p-2 w-full rounded-md border-gray-300 shadow-sm bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Password Reset Button */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <button 
                        type="button"
                        onClick={handlePasswordResetRequest}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
                    >
                        {loadingForgot ? 'Sending reset link...' : 'Send Password Reset Link'}
                    </button>
                </div>

                {/* contactNumber */}
                <div className="mb-6">
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <textarea
                        id="contactNumber"
                        name="contactNumber"
                        value={admin.contactNumber}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Write contact number/s"
                        className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Save Changes */}
                <button 
                    type="submit" 
                    className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
                >
                    {loadingUpdate ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default AdminProfileSettings;
