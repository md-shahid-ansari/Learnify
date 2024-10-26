import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './HomePage/LandingPage';
import StudentHome from './Student/StudentHome';
import MentorHome from './Mentor/MentorHome';
import AdminHome from './Admin/AdminHome';

import StudentDashboard from './Student/Pages/StudentDashboard';
import ProjectDetails from './Student/Pages/ProjectDetails';
import ChallengeDetails from './Student/Pages/ChallengeDetails';
import StudentProfileSettings from './Student/Pages/StudentProfileSettings';
import LearningPath from './Student/Pages/LearningPath';

import MentorDashboard from './Mentor/Pages/MentorDashboard';
import ProjectDetailMentor from './Mentor/Pages/ProjectDetailMentor';
import ChallengeDetailMentor from './Mentor/Pages/ChallengeDetailMentor';
import MentorFeedback from './Mentor/Pages/MentorFeedback';
import MentorProfileSettings from './Mentor/Pages/MentorProfileSettings';
import MentorLearningPath from './Mentor/Pages/MentorLearningPath';

import AdminDashboard from './Admin/Pages/AdminDashboard';
import ManageUsers from './Admin/Pages/ManageUsers';
import ManageChallenges from './Admin/Pages/ManageChallenges';
import ManageProjects from './Admin/Pages/ManageProjects';
import ReportsAnalytics from './Admin/Pages/ReportAnalytics';
import AdminProfile from './Admin/Pages/AdminProfile';

import LoginPage from './Auth/LoginPage';
import RegistrationPage from './Auth/RegistrationPage';

import axios from 'axios';

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegistrationPage />} />

        <Route path="/student-home" element={<StudentHome />}>
          {/* Default path for Outlet */}
          <Route index element={<Navigate to="student-dashboard" />} />

          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="project-details" element={<ProjectDetails />} /> {/* Removed project prop */}
          <Route path="challenge-details" element={<ChallengeDetails />} /> {/* Removed challenges prop */}
          <Route path="learning-path" element={<LearningPath/>} />
          <Route path="student-profile-settings" element={<StudentProfileSettings />} />
        </Route>

        <Route path="/mentor-home" element={<MentorHome />}>
          {/* Default path for Outlet */}
          <Route index element={<Navigate to="mentor-dashboard" />} />

          <Route path="mentor-dashboard" element={<MentorDashboard />} />
          <Route path="projects" element={<ProjectDetailMentor />} /> 
          <Route path="challenges" element={<ChallengeDetailMentor />} /> 
          <Route path="mentor-learning" element={<MentorLearningPath />} />
          <Route path="mentor-feedback" element={<MentorFeedback/>} />
          <Route path="mentor-profile-settings" element={<MentorProfileSettings />} />
        </Route>

        <Route path="/company-home" element={<AdminHome />}>
          <Route index element={<AdminDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-challenges" element={<ManageChallenges />} />
          <Route path="manage-projects" element={<ManageProjects />} />
          <Route path="reports-analytics" element={<ReportsAnalytics />} />
          <Route path="admin-profile" element={<AdminProfile />} />
        </Route>


        {/* Catch all routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
};

export default App;
