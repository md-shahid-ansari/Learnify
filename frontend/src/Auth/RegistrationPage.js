import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';  // Import axios

const URL = process.env.REACT_APP_BACKEND_URL;

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    skills: '',
    bio: '',
    contactNumber: '', // Contact number for Admin
    otp: '',
  });
  
  const [error, setError] = useState(null);  // State to manage error messages
  const [loading, setLoading] = useState(false);  // State to manage loading state
  const [isOtpSent, setIsOtpSent] = useState(false); // State to manage OTP form visibility
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const { role, name, email, password, skills, bio, contactNumber } = formData;

    try {
      const response = await axios.post(`${URL}/api/auth/${role.toLowerCase()}-register`, {
        name,
        email,
        password,
        skills: role === 'Student' ? skills : undefined,
        bio: role === 'Tutor' ? bio : undefined,
        contactNumber: role === 'Admin' ? contactNumber : undefined, // Add contact number for Admin
      });

      if (response.data.success) {
        setSelectRole(role.toLowerCase());
        // OTP sent successfully, show the verification form
        setIsOtpSent(true);
      } else {
        // Handle error case
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Server is not responding.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (formData.otp.length !== 6) {
      setError('Enter a 6-digit OTP.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${URL}/api/auth/${selectRole}-verify`, {
        code: formData.otp
      });

      if (response.data.success) {
        // Verification successful, navigate to home page based on role
        navigate(`/${selectRole}-home`);
      } else {
        setError(response.data.message || 'Verification failed.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Server is not responding.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 justify-center items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Learnify</h2>
          <p className="mt-2 text-lg">Join the platform to bridge the gap between academia and industry.</p>
        </div>
      </div>

      {/* design */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center">Create an Account</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
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
            {formData.role === 'Student' && (
              <div className="form-group">
                <label className="block text-sm font-medium">Skills (for students)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="List your skills (comma-separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
            )}
            {formData.role === 'Tutor' && (
              <div className="form-group">
                <label className="block text-sm font-medium">Short Bio (for mentors)</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                ></textarea>
              </div>
            )}
            {formData.role === 'Admin' && (
              <div className="form-group">
                <label className="block text-sm font-medium">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
            <p className="text-center">
              <Link to={`/login-page`} className="text-indigo-600 hover:underline">
                Already registered? Click here to login!
              </Link>
            </p>
          </form>
          {isOtpSent && (
            <form onSubmit={handleOtpSubmit} className="mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter the OTP sent to your email"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
