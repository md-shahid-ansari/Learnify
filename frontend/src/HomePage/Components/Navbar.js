import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">ACADEMIX</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login-page">Login</Link></li>
                <li><Link to="/register-page">Register</Link></li>
                <li><Link to="/student-home">Student Home</Link></li>
                <li><Link to="/mentor-home">Mentor Home</Link></li>
                <li><Link to="/company-home">Admin Home</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
