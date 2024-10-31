import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './HomePage/LandingPage';
import StudentHome from './Student/StudentHome';
import TutorHome from './Tutor/TutorHome';
import AdminHome from './Admin/AdminHome';

import StudentDashboard from './Student/Pages/StudentDashboard';
import StudentProfileSettings from './Student/Pages/StudentProfileSettings';
import StudentCertificate from './Student/Pages/StudentCertificate';
import StudentCourse from './Student/Pages/StudentCourse';

import TutorDashboard from './Tutor/Pages/TutorDashboard';
import TutorCourse from './Tutor/Pages/TutorCourse';
import TutorProfileSettings from './Tutor/Pages/TutorProfileSettings';

import AdminDashboard from './Admin/Pages/AdminDashboard';
import AdminProfile from './Admin/Pages/AdminProfile';
import AdminCourse from './Admin/Pages/AdminCourse';
import ManageUsers from './Admin/Pages/ManageUsers';

import LoginPage from './Auth/LoginPage';
import RegistrationPage from './Auth/RegistrationPage';
import AdminResetPage from './Auth/AdminResetPage';
import StudentResetPage from './Auth/StudentResetPage';
import TutorResetPage from './Auth/TutorResetPage';
import Courses from './HomePage/Components/Courses';

import axios from 'axios';

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <div className="min-w-[600px] mx-auto">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} >
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Courses />} />
            <Route path="login-page" element={<LoginPage />} />
            <Route path="register-page" element={<RegistrationPage />} />
            <Route path="admin-reset/:token" element={<AdminResetPage />} />
            <Route path="student-reset/:token" element={<StudentResetPage />} />
            <Route path="tutor-reset/:token" element={<TutorResetPage />} />
          </Route>

          <Route path="/student-home" element={<StudentHome />}>
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="student-dashboard" />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="student-course" element={<StudentCourse />} />
            <Route path="student-certificate" element={<StudentCertificate />} />
            <Route path="student-profile" element={<StudentProfileSettings />} />
          </Route>

          <Route path="/tutor-home" element={<TutorHome />}>
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="tutor-dashboard" />} />
            <Route path="tutor-dashboard" element={<TutorDashboard />} />
            <Route path="tutor-course" element={<TutorCourse />} />
            <Route path="tutor-profile" element={<TutorProfileSettings />} />
          </Route>

          <Route path="/admin-home" element={<AdminHome />}>
            <Route index element={<Navigate to="admin-dashboard" />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-course" element={<AdminCourse />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="admin-profile" element={<AdminProfile />} />
          </Route>

          {/* Catch all routes */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
