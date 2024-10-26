import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file
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
    <div className="login-container">
      <div className="bubble-background">
        <div className="bubble bubble1"></div>
        <div className="bubble bubble2"></div>
        <div className="bubble bubble3"></div>
        <div className="bubble bubble4"></div>
        <div className="bubble bubble5"></div>
      </div>

      <div className="login-box">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>I am a:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Mentor">Mentor</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <button type="submit" className="login-button" disabled={loadingLogin}>
            {loadingLogin ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            className="forgot-password"
            disabled={loadingForgot}
            onClick={handleForgot}
          >
            {loadingForgot ? 'Sending reset link...' : 'Forgot Password?'}
          </button>
          {error && <div className="error-message">{error}</div>}
          <p>
            <Link to={`/register-page`}>
              Not registered? Click here to register!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
