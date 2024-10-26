import React, { useState } from 'react';
import './AdminDashboard.css';
import ManageUsers from './ManageUsers';
import ManageChallenges from './ManageChallenges';
import ReportAnalytics from './ReportAnalytics';

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
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ManageUsers users={users}/>
            <ManageChallenges challenges={challenges} />
            <ReportAnalytics reports={reports} />

            <section className="manage-users">
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
                    <p>No users to manage at the moment.</p>
                )}
            </section>

            <section className="manage-challenges">
                <h2>Manage Challenges</h2>
                {challenges.length > 0 ? (
                    <table className="challenge-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {challenges.map((challenge, index) => (
                                <tr key={index}>
                                    <td>{challenge.title}</td>
                                    <td>{challenge.company}</td>
                                    <td>{challenge.status}</td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No challenges available to manage at this time.</p>
                )}
            </section>

            <section className="reports-analytics">
                <h2>Reports and Analytics</h2>
                {reports ? (
                    <div className="report">
                        <p>Total Users: {reports.totalUsers}</p>
                        <p>Total Challenges Posted: {reports.totalChallenges}</p>
                        <p>Total Submissions: {reports.totalSubmissions}</p>
                    </div>
                ) : (
                    <p>No reports available at the moment.</p>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;