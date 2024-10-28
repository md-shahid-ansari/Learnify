import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentCourse = () => {
    const [learningPath, setLearningPath] = useState({
        pathTitle: '',
        description: '',
        modules: [],
        certifications: []
    });

    useEffect(() => {
        const fetchLearningPath = async () => {
            try {
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
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLearningPath(response);
            } catch (error) {
                console.error('Error fetching learning path data:', error);
            }
        };

        fetchLearningPath();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{learningPath.pathTitle}</h1>
                <p className="text-gray-600 mt-2">{learningPath.description}</p>
            </header>

            {/* Modules Section */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Modules</h2>
                <ul className="space-y-4">
                    {learningPath.modules.map((module) => (
                        <li key={module.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                                <p className="text-gray-500">Status: {module.progress}</p>
                            </div>
                            {module.progress !== 'Completed' && (
                                <Link to={`/module/${module.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
                                    Next Module
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Recommended Certifications Section */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recommended Certifications</h2>
                <ul className="space-y-4">
                    {learningPath.certifications.map((cert, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800">{cert.title}</h3>
                            <p className="text-gray-500">{cert.description}</p>
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition duration-300 mt-2 inline-block">
                                Learn More
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default StudentCourse;
