import React, { useState } from 'react';
import './ManageUsers.css';

const ManageUsers = () => {
    // Example users data
    const [users, setUsers] = useState([
        { name: 'John Doe', role: 'Mentor', email: 'john.doe@example.com' },
        { name: 'Jane Smith', role: 'Student', email: 'jane.smith@example.com' },
        { name: 'Alice Johnson', role: 'Admin', email: 'alice.johnson@example.com' },
    ]);

    return (
        <div className="manage-users">
            <h2>Manage Users</h2>
            {users.length > 0 ? (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users available.</p>
            )}
        </div>
    );
};

export default ManageUsers;
