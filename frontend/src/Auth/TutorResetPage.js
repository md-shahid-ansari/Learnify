import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const TutorResetPage = () => {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true before making API call
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false); // Set loading state to false if there's a mismatch
      return;
    }

    try {
      const response = await axios.post(`${URL}/api/auth/tutor-reset/${token}`, {
        password: formData.password,
      });

      if (response.data.success) {
        setSuccess('Password reset successfully. Redirecting to login page...');
        setTimeout(() => navigate('/tutor-login'), 3000); // Redirect to tutor login after 3 seconds
      } else {
        setError(response.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-gray-300 shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded" disabled={loading}>
            {loading ? 'Working...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorResetPage;
