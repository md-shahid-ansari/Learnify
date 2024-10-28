import React, { useState } from 'react';

const AdminDashboard = () => {
    // Use hooks to manage state
    const [users] = useState([
        { name: 'John Doe', role: 'Student', email: 'john.doe@example.com' },
        { name: 'Jane Smith', role: 'Mentor', email: 'jane.smith@example.com' },
        // Add more sample users if needed
    ]);

    const [challenges] = useState([
        { title: 'AI Challenge', company: 'Tech Corp', status: 'Open' },
        { title: 'Web Development Challenge', company: 'Web Solutions', status: 'Closed' },
        // Add more sample challenges if needed
    ]);

    const [reports] = useState({
        totalUsers: 100,
        totalChallenges: 50,
        totalSubmissions: 200,
    });

    return (
        <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <section className="manage-users mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
                {users.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.role}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No users to manage at the moment.</p>
                )}
            </section>

            <section className="manage-challenges mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Challenges</h2>
                {challenges.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Title</th>
                                <th className="py-2 px-4 text-left">Company</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {challenges.map((challenge, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{challenge.title}</td>
                                    <td className="py-2 px-4">{challenge.company}</td>
                                    <td className="py-2 px-4">{challenge.status}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No challenges available to manage at this time.</p>
                )}
            </section>

            <section className="reports-analytics mb-8">
                <h2 className="text-2xl font-semibold mb-4">Reports and Analytics</h2>
                {reports ? (
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <p className="text-lg font-medium">Total Users: <span className="font-normal">{reports.totalUsers}</span></p>
                        <p className="text-lg font-medium">Total Challenges Posted: <span className="font-normal">{reports.totalChallenges}</span></p>
                        <p className="text-lg font-medium">Total Submissions: <span className="font-normal">{reports.totalSubmissions}</span></p>
                    </div>
                ) : (
                    <p className="text-gray-600">No reports available at the moment.</p>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
