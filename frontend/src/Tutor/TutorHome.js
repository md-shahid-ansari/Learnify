import React from 'react';
import MentorSidebar from './TutorSidebar';
import { Outlet,Link } from 'react-router-dom';

const TutorHome = () => {
    return (
        <div className="mentor-home">
            <nav className="mentor-home-header">
                <h1>ACADEMIX</h1>
                <div className="profile">
                    <Link to="mentor-profile-settings" className="profile-link">Mentor Profile</Link>
                </div>
            </nav>
             <div className="mentor-main-content">
                <MentorSidebar />
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default TutorHome;




