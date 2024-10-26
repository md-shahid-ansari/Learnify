import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        studentName: 'John Doe', // Example name
        learningPaths: [], // Initialize with an empty array
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [challenges, setChallenges] = useState([]);
    
    useEffect(() => {
        let isMounted = true;

        const authenticate = async () => {
            const { isAuthenticated, studentData } = await IsStudentSessionLive();

            if (!isMounted) return;

            if (!isAuthenticated) {
                setError('You are not authenticated. Please log in again.');
                navigate('/student-login');
                setLoading(false);
                return;
            }

            // Ensure studentData is set correctly
            setStudentData({
                ...studentData,
                learningPaths: studentData.learningPaths || [], // Ensure learningPaths is an array
            });
        };

        const fetchProjectsAndChallenges = async () => {
            try {
                const [projectsResponse, challengesResponse] = await Promise.all([
                    axios.post(`${URL}/api/auth/fetch-projects`),
                    axios.post(`${URL}/api/auth/fetch-challenges`),
                ]);

                setProjects(projectsResponse.data.data);
                setChallenges(challengesResponse.data);
            } catch (err) {
                setError('Failed to fetch projects and challenges. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        authenticate().then(fetchProjectsAndChallenges);
        
        return () => {
            isMounted = false; // Clean up the effect
        };
    }, [navigate]);

    // Example learning paths data (this will be replaced with actual API data)
    const exampleLearningPaths = [
        { name: 'Web Development', progress: 70, nextModule: 'JavaScript Frameworks' },
        { name: 'Data Science', progress: 50, nextModule: 'Machine Learning Basics' },
        { name: 'Mobile App Development', progress: 30, nextModule: 'React Native Basics' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Use optional chaining to safely access learningPaths
    const learningPaths = studentData.learningPaths?.length > 0 ? studentData.learningPaths : exampleLearningPaths;

    return (
        <div className="student-dashboard">
            <nav className="student-dashboard-header">
                <h1>Welcome {studentData.studentName}</h1>
                <p>Here are your ongoing projects, learning paths, and challenges.</p>
            </nav>

            {/* Ongoing Projects */}
            <section className="ongoing-projects">
                <h2>Ongoing Projects</h2>
                {projects.length > 0 ? (
                    <ul>
                        {projects.map((project) => (
                            <li key={project.projectId} className="project-card">
                                <h3>
                                    <Link to={`/project/${project.projectId}`}>{project.projectTitle}</Link>
                                </h3>
                                <p>Status: {project.status}</p>
                                <p>Tasks Assigned: {project.taskList.length}</p>
                                {/* <button className="submit-github-btn">Submit GitHub Link</button> */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ongoing projects available at the moment.</p>
                )}
            </section>

            {/* Learning Paths */}
            <section className="learning-paths">
                <h2>Learning Paths</h2>
                {learningPaths.length > 0 ? (
                    <ul>
                        {learningPaths.map((path, index) => (
                            <li key={index} className="path-card">
                                <h3>{path.name}</h3>
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${path.progress}%` }}></div>
                                    <span>{path.progress}%</span>
                                </div>
                                <p>Next Module: {path.nextModule}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No learning paths available at the moment.</p>
                )}
            </section>

            {/* Challenges */}
            <section className="ongoing-challenges">
                <h2>Ongoing Challenges</h2>
                {challenges.length > 0 ? (
                    <ul>
                        {challenges.map((challenge) => (
                            <li key={challenge.challengeId} className="challenge-card">
                                <h3>
                                    <Link to={`/challenge/${challenge.challengeId}`}>{challenge.title}</Link>
                                </h3>
                                <p>Deadline: {challenge.deadline}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ongoing challenges available at the moment.</p>
                )}
            </section>
        </div>
    );
};

export default StudentDashboard;
