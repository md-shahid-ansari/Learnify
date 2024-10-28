import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './HomePage/LandingPage';
import StudentHome from './Student/StudentHome';
import MentorHome from './Mentor/MentorHome';
import AdminHome from './Admin/AdminHome';

import StudentDashboard from './Student/Pages/StudentDashboard';
import StudentProfileSettings from './Student/Pages/StudentProfileSettings';

import MentorDashboard from './Mentor/Pages/MentorDashboard';
import MentorProfileSettings from './Mentor/Pages/MentorProfileSettings';

import AdminDashboard from './Admin/Pages/AdminDashboard';
import AdminProfile from './Admin/Pages/AdminProfile';

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
        <Routes>
          <Route path="/" element={<LandingPage />} >
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="courses" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login-page" element={<LoginPage />} />
            <Route path="/register-page" element={<RegistrationPage />} />
            <Route path="/admin-reset/:token" element={<AdminResetPage />} />
            <Route path="/student-reset/:token" element={<StudentResetPage />} />
            <Route path="/tutor-reset/:token" element={<TutorResetPage />} />
          </Route>

          <Route path="/student-home" element={<StudentHome />}>
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="student-dashboard" />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="student-profile-settings" element={<StudentProfileSettings />} />
          </Route>

          <Route path="/tutor-home" element={<MentorHome />}>
            {/* Default path for Outlet */}
            <Route index element={<Navigate to="tutor-dashboard" />} />
            <Route path="tutor-dashboard" element={<MentorDashboard />} />
            <Route path="tutor-profile-settings" element={<MentorProfileSettings />} />
          </Route>

          <Route path="/admin-home" element={<AdminHome />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
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
