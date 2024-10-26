import React, { useState } from 'react';
import './AdminProfile.css'; // Add styles here

const AdminProfileSettings = () => {
    const [adminData, setAdminData] = useState({
        name: "Admin Name",
        email: "admin@example.com",
        password: "",
        role: "Administrator",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Admin Data:", adminData);
        alert("Profile updated successfully!");
    };

    return (
        <div className="admin-profile-container">
            <h1>Company Profile Settings</h1>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={adminData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={adminData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={adminData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={adminData.role}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminProfileSettings;
