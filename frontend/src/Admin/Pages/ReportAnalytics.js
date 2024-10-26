import React, { useState } from 'react';
import './ReportAnalytics.css';

const ReportsAnalytics = () => {
    // Example reports data
    const [reports] = useState({
        totalUsers: 150,
        totalChallenges: 25,
        totalSubmissions: 120,
    });

    return (
        <div className="reports-analytics">
            <h2>Reports and Analytics</h2>
            {reports ? (
                <div className="report">
                    <p>Total Users: {reports.totalUsers}</p>
                    <p>Total Challenges Posted: {reports.totalChallenges}</p>
                    <p>Total Submissions: {reports.totalSubmissions}</p>
                </div>
            ) : (
                <p>No reports available.</p>
            )}
        </div>
    );
};

export default ReportsAnalytics;
