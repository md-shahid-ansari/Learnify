import React, { useState, useEffect } from 'react';

const AdminCourse = () => {
    const [learningPath, setLearningPath] = useState({
        pathTitle: '',
        description: '',
        modules: [],
        certifications: []
    });

    // Fetch the course data when component mounts
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

    const handleEditModule = (id) => {
        // Implement module editing logic
        console.log(`Editing module ${id}`);
    };

    const handleDeleteModule = (id) => {
        // Implement module deletion logic
        setLearningPath(prev => ({
            ...prev,
            modules: prev.modules.filter(module => module.id !== id)
        }));
    };

    const handleAddModule = () => {
        // Implement add module logic
        console.log("Adding a new module");
    };

    const handleEditCertification = (index) => {
        // Implement certification editing logic
        console.log(`Editing certification ${index}`);
    };

    const handleDeleteCertification = (index) => {
        // Implement certification deletion logic
        setLearningPath(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, idx) => idx !== index)
        }));
    };

    const handleAddCertification = () => {
        // Implement add certification logic
        console.log("Adding a new certification");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{learningPath.pathTitle}</h1>
                <p className="text-gray-600 mt-2">{learningPath.description}</p>
            </header>

            {/* Modules Section */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Modules</h2>
                    <button onClick={handleAddModule} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                        Add Module
                    </button>
                </div>
                <ul className="space-y-4">
                    {learningPath.modules.map((module) => (
                        <li key={module.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                                <p className="text-gray-500">Status: {module.progress}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEditModule(module.id)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteModule(module.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Certifications Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Certifications</h2>
                    <button onClick={handleAddCertification} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                        Add Certification
                    </button>
                </div>
                <ul className="space-y-4">
                    {learningPath.certifications.map((cert, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{cert.title}</h3>
                                <p className="text-gray-500">{cert.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEditCertification(index)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteCertification(index)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminCourse;
