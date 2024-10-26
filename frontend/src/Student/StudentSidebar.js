import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentHome.css';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL


const StudentSidebar = () => {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [error , setError] = useState();

  const logout = async (e) => {
    e.preventDefault();
    setLoadingLogout(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/auth/student-logout`);

      if (response.data.success) {
        // Logged in successfully, navigate to role-specific home page
        navigate(`/`);
      } else {
        // Handle error case
        setError(response.data.message || 'Logout failed.');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Server is not responding.');
      }
    } finally {
      setLoadingLogout(false);
    }
  };
  return (
    <div className="student-sidebar">
      <nav>
        <ul>
          <li><Link to="student-dashboard">Dashboard</Link></li>
          <li><Link to="project-details">Project Details</Link></li>
          <li><Link to="challenge-details">Challenge Details</Link></li>
          <li><Link to="learning-path">Learning Path</Link></li>
        </ul>
      </nav>
      <div className="logout-btn"><button onClick={logout}>Logout</button></div>
    </div>
  );
};

export default StudentSidebar;
