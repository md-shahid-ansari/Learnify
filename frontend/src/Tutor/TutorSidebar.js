import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const TutorSidebar = () => {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [error, setError] = useState(null);

  const logout = async (e) => {
    e.preventDefault();
    setLoadingLogout(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/auth/tutor-logout`);

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
    <div className="bg-gray-800 text-white h-full min-h-screen w-64 p-4 flex flex-col justify-between">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="tutor-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="tutor-learning" className="block py-2 px-4 rounded hover:bg-gray-700">
              Learnings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-4">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={logout}
          disabled={loadingLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded mt-4"
        >
          {loadingLogout ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default TutorSidebar;
