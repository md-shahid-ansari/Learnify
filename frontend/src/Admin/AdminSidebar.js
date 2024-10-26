import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHome.css';

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <nav>
                <ul>
                    <li><Link to="admin-dashboard">Dashboard</Link></li>
                    <li><Link to="manage-users">Manage Users</Link></li>
                    <li><Link to="manage-challenges">Manage Challenges</Link></li>
                    <li><Link to="manage-projects">Manage Projects</Link></li>
                    <li><Link to="reports-analytics">Reports and Analytics</Link></li>
                </ul>
            </nav>
            <div className="logout-btn"><button>Logout</button></div>
        </div>
    );
};

export default AdminSidebar;
