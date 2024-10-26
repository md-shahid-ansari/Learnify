import React from 'react';
import StudentSidebar from './StudentSidebar';
import { Outlet, Link } from 'react-router-dom';
import './StudentHome.css';



const StudentHome = () => {
  return (
    <div className="student-home">
      <nav className="student-home-header">
        <h1>ACADEMIX</h1>
        <div className="profile">
          <Link to="student-profile-settings" className="profile-link">Student Profile</Link>
        </div>
      </nav>
      <div className="main-content">
        <StudentSidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
