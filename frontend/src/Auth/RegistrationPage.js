import React, { useState } from 'react';
import './RegistrationPage.css'; // Import the CSS file
import {useNavigate, Link } from 'react-router-dom';
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
    profilePicture: null,
    otp: '',
  });
  
  const [error, setError] = useState(null);  // State to manage error messages
  const [loading, setLoading] = useState(false);  // State to manage loading state
  const [isOtpSent, setIsOtpSent] = useState(false); // State to manage OTP form visibility
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
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

    const { role, name, email, password, skills, bio } = formData;

    try {
      const response = await axios.post(`${URL}/api/auth/${role.toLowerCase()}-register`, {
        name,
        email,
        password,
        skills: role === 'Student' ? skills : undefined,
        bio: role === 'Mentor' ? bio : undefined,
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
    <div className="registration-container">
      {/* design */}
      <div className="left-side">
        <div className="bubble-background">
          <div className="bubble bubble1"></div>
          <div className="bubble bubble2"></div>
          <div className="bubble bubble3"></div>
          <div className="bubble bubble4"></div>
          <div className="bubble bubble5"></div>
        </div>
        <div className="welcome-text">
          <h2>Create an Account</h2>
          <p>Join the platform to bridge the gap between academia and industry.</p>
        </div>
      </div>

      {/* design */}
      <div className="right-side">
        {!isOtpSent ? (
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>I am a:</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Company">Company</option>
              </select>
            </div>
            {formData.role === 'Student' && (
              <div className="form-group">
                <label>Skills (for students)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="List your skills (comma-separated)"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            )}
            {formData.role === 'Mentor' && (
              <div className="form-group">
                <label>Short Bio (for mentors)</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}
            <div className="form-group">
              <label>Upload Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
            <p>
              <Link to={`/login-page`}>
                Already registered? Click here to login!
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="verification-form">
            <div className="form-group">
              <label>Enter the 6-digit OTP:</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
