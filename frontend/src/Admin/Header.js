import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showErrorToast } from '../Toast/toasts';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

function Header() {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const logout = async (e) => {
    e.preventDefault();
    setLoadingLogout(true);

    try {
      const response = await axios.post(`${URL}/api/auth/admin-logout`);

      if (response.data.success) {
        navigate(`/`);
      } else {
        showErrorToast(response.data.message || 'Logout failed.');
      }
    } catch (err) {
      if (err.response) {
        showErrorToast(err.response.data.message || 'Something went wrong.');
      } else {
        showErrorToast('Server is not responding.');
      }
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <header className="fixed top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white  z-10">
      <div className="mr-1 text-2xl font-bold">Learnify</div>
      <div className="flex items-center space-x-1">
        {/* Search Input with Icon */}
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-blue-200 max-w-xs">
          <i className="fas fa-search text-gray-500 text-xl ml-2"></i>
          <input
            type="text"
            placeholder="Search courses..."
            className="ml-2 bg-blue-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-none w-full"
          />
        </div>

        {/* Navigation Links */}
        <Link
          to="/admin-home/admin-dashboard"
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-tachometer-alt text-xl" title="Dashboard"></i>
        </Link>
        <Link
          to="/admin-home/manage-users"
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-users text-xl" title="Manage Users"></i>
        </Link>
        <Link
          to="/admin-home/admin-course"
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-book text-xl" title="Manage Courses"></i>
        </Link>
        <Link
          to="/admin-home/admin-profile"
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-user text-xl" title="Profile"></i>
        </Link>
        <Link
          onClick={logout}
          disabled={loadingLogout}
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-sign-out-alt text-xl" title="Logout"></i>
        </Link>
      </div>
    </header>
  );
}

export default Header;
