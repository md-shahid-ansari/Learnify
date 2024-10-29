import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const StudentSidebar = () => {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [error, setError] = useState(null);

  const logout = async (e) => {
    e.preventDefault();
    setLoadingLogout(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/auth/student-logout`);

      if (response.data.success) {
        navigate(`/`);
      } else {
        setError(response.data.message || 'Logout failed.');
      }
    } catch (err) {
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
    <div className="student-sidebar w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="student-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="student-course" className="block py-2 px-4 rounded hover:bg-gray-700">
              Courses
            </Link>
          </li>
          <li>
            <Link to="student-certificate" className="block py-2 px-4 rounded hover:bg-gray-700">
              Certificates
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={logout}
          className={`bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-150 ease-in-out ${
            loadingLogout ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={loadingLogout}
        >
          {loadingLogout ? 'Logging Out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
