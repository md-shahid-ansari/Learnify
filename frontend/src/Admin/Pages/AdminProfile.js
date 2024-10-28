import React, { useState } from 'react';

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
        <div className="admin-profile-container max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Company Profile Settings</h1>
            <form className="profile-form space-y-4" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={adminData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={adminData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={adminData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role" className="block text-gray-700 font-medium mb-1">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={adminData.role}
                        onChange={handleChange}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminProfileSettings;
