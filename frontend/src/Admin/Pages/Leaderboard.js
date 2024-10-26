import React, { useState } from 'react';
import './Leaderboard.css'; // Ensure you create and style this CSS file

const Leaderboard = () => {
    // Example leaderboard data
    const [leaderboard] = useState([
        { name: 'Alice', score: 120 },
        { name: 'Bob', score: 95 },
        { name: 'Charlie', score: 85 },
        { name: 'David', score: 70 },
        { name: 'Eve', score: 60 },
    ]);

    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            {leaderboard.length > 0 ? (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No leaderboard data available.</p>
            )}
        </div>
    );
};

export default Leaderboard;
