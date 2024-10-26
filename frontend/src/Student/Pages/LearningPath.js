import React, { useState, useEffect } from 'react';
import './LearningPath.css';
import { Link } from 'react-router-dom';

const LearningPath = () => {
    // State to hold the learning path data
    const [learningPath, setLearningPath] = useState({
        pathTitle: '',
        description: '',
        modules: [],
        certifications: []
    });

    // Fetch the learning path details from the server
    useEffect(() => {
        // Simulate fetching from server with async function
        const fetchLearningPath = async () => {
            try {
                // Example server response (replace with actual API call)
                const response = {
                    pathTitle: "Full Stack Development",
                    description: "A comprehensive learning path to master Full Stack Development.",
                    modules: [
                        { id: 1, title: "HTML & CSS Basics", progress: "Completed" },
                        { id: 2, title: "JavaScript Fundamentals", progress: "In Progress" },
                        { id: 3, title: "React and Redux", progress: "Not Started" }
                    ],
                    certifications: [
                        { title: "Front-End Developer Certification", description: "Earn a certification by mastering front-end skills.", link: "https://frontend-certification.com" },
                        { title: "Full-Stack Developer Certification", description: "Become a certified Full Stack Developer.", link: "https://fullstack-certification.com" }
                    ]
                };

                // Simulate a delay (replace with actual fetch in production)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Set the fetched data into state
                setLearningPath(response);
            } catch (error) {
                console.error('Error fetching learning path data:', error);
            }
        };

        fetchLearningPath(); // Call the function to fetch data
    }, []); // Empty dependency array to run only once

    return (
        <div className="learning-path">
            <nav className="learning-path-header">
                <h1>{learningPath.pathTitle}</h1>
                <p>{learningPath.description}</p>
            </nav>
            
            {/* Modules Section */}
            <section className="modules-section">
                <h2>Modules</h2>
                <ul>
                    {learningPath.modules.map((module, index) => (
                        <li key={index} className="module-card">
                            <h3>{module.title}</h3>
                            <p>Status: {module.progress}</p>
                            {module.progress !== 'Completed' && (
                                <Link to={`/module/${module.id}`} className="next-btn">Next Module</Link>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Recommended Certifications Section */}
            <section className="certifications-section">
                <h2>Recommended Certifications</h2>
                <ul>
                    {learningPath.certifications.map((cert, index) => (
                        <li key={index} className="certification-card">
                            <h3>{cert.title}</h3>
                            <p>{cert.description}</p>
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">Learn More</a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default LearningPath;
