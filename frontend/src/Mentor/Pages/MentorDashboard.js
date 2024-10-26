import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MentorDashboard.css'; // Ensure to create and style this CSS file

const MentorDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [feedbackRequests, setFeedbackRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentorDashboardData = async () => {
            try {
                // Simulate an API call with a delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock mentor dashboard data
                const mockData = {
                    projects: [
                        {
                            id: 1,
                            title: 'AI Farming Solution',
                            students: [{ name: 'Alice' }, { name: 'Bob' }],
                            mentorRequests: ['Request from Charlie', 'Request from Dave'],
                        },
                        {
                            id: 2,
                            title: 'Weather Prediction Model',
                            students: [{ name: 'Eve' }],
                            mentorRequests: [],
                        },
                    ],
                    challenges: [
                        { id: 1, title: 'Coding Challenge #1', company: 'Tech Company A' },
                        { id: 2, title: 'Data Science Challenge', company: 'Tech Company B' },
                    ],
                    feedbackRequests: [
                        { studentName: 'Alice', projectTitle: 'AI Farming Solution', projectId: 1 },
                        { studentName: 'Eve', projectTitle: 'Weather Prediction Model', projectId: 2 },
                    ],
                };
                
                // Setting the state with fetched data
                setProjects(mockData.projects);
                setChallenges(mockData.challenges);
                setFeedbackRequests(mockData.feedbackRequests);
            } catch (err) {
                setError('Failed to fetch mentor dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchMentorDashboardData();
    }, []); // Empty dependency array to run only once on component mount

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="mentor-dashboard">
            <nav>
                <h1>Mentor Dashboard</h1>
            </nav>

            {/* Projects You're Guiding */}
            <section className="guiding-projects">
                <h2>Projects You’re Guiding</h2>
                {projects.length > 0 ? (
                    <ul>
                        {projects.map((project, index) => (
                            <li key={index} className="project-card">
                                <h3>
                                    <Link to={`/project/${project.id}`}>{project.title}</Link>
                                </h3>
                                <p>Students Assigned:</p>
                                <ul className="student-list">
                                    {project.students.map((student, i) => (
                                        <li key={i}>{student.name}</li>
                                    ))}
                                </ul>
                                {project.mentorRequests.length > 0 ? (
                                    <p className="mentor-requests">Mentor Requests: {project.mentorRequests.length}</p>
                                ) : (
                                    <p>No mentor requests.</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects assigned to you yet.</p>
                )}
            </section>

            {/* Active Challenges */}
            <section className="active-challenges">
                <h2>Challenges</h2>
                {challenges.length > 0 ? (
                    <ul>
                        {challenges.map((challenge, index) => (
                            <li key={index} className="challenge-card">
                                <h3>
                                    <Link to={`/challenge/${challenge.id}`}>{challenge.title}</Link>
                                </h3>
                                <p>Posted by: {challenge.company}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No active challenges at the moment.</p>
                )}
            </section>

            {/* Feedback Section */}
            <section className="feedback-section">
                <h2>Feedback Section</h2>
                {feedbackRequests.length > 0 ? (
                    <ul>
                        {feedbackRequests.map((submission, index) => (
                            <li key={index} className="feedback-card">
                                <p>Submission by: {submission.studentName}</p>
                                <p>Project: {submission.projectTitle}</p>
                                <Link to={`/project/${submission.projectId}`}>View Submission</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No submissions awaiting feedback.</p>
                )}
            </section>
        </div>
    );
};

export default MentorDashboard;
