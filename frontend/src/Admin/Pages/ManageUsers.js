import React, { useState } from 'react';

const ManageUsers = () => {
    // Example users data
    const [users, setUsers] = useState([
        { name: 'John Doe', role: 'Mentor', email: 'john.doe@example.com' },
        { name: 'Jane Smith', role: 'Student', email: 'jane.smith@example.com' },
        { name: 'Alice Johnson', role: 'Admin', email: 'alice.johnson@example.com' },
    ]);

    return (
        <div className="manage-users max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>
            {users.length > 0 ? (
                <table className="user-table w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left text-gray-700 font-semibold">Name</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Role</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Email</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3 flex space-x-2">
                                    <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Edit</button>
                                    <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">No users available.</p>
            )}
        </div>
    );
};

export default ManageUsers;
