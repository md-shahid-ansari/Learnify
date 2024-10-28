import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student' // Default role
  });
  const [error, setError] = useState(null);  // State to manage error messages
  const [loadingLogin, setLoadingLogin] = useState(false);  // State to manage loading state
  const [loadingForgot, setLoadingForgot] = useState(false);  // State to manage loading state

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/auth/${formData.role.toLowerCase()}-login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Logged in successfully, navigate to role-specific home page
        navigate(`/${formData.role.toLowerCase()}-home`);
      } else {
        // Handle error case
        setError(response.data.message || 'Login failed.');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Server is not responding.');
      }
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoadingForgot(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/auth/${formData.role.toLowerCase()}-forgot`, {
        email: formData.email
      });

      if (!response.data.success) {
        // Handle error case
        setError(response.data.message || 'Reset link failed to send.');
      } else {
        setError(response.data.message || 'Reset link sent successfully.');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Server is not responding.');
      }
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-gray-300 shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
              <label className="block text-sm font-medium">I am a:</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200">
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Tutor">Tutor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded" disabled={loadingLogin}>
            {loadingLogin ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            className="w-full text-blue-500 hover:underline"
            disabled={loadingForgot}
            onClick={handleForgot}
          >
            {loadingForgot ? 'Sending reset link...' : 'Forgot Password?'}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <p className="text-center">
            <Link to={`/register-page`} className="text-blue-500 hover:underline">
              Not registered? Click here to register!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
