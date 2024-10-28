import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        studentName: 'John Doe',
        learningPaths: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            setStudentData({
                ...studentData,
                learningPaths: studentData.learningPaths || [],
            });
        };

        authenticate().then(() => setLoading(false));

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    // Example learning paths and courses data
    const exampleLearningPaths = [
        { name: 'Web Development', progress: 70, nextModule: 'JavaScript Frameworks' },
        { name: 'Data Science', progress: 50, nextModule: 'Machine Learning Basics' },
        { name: 'Mobile App Development', progress: 30, nextModule: 'React Native Basics' },
    ];

    const exampleCourses = [
        { name: 'Introduction to Python', progress: 85 },
        { name: 'React Fundamentals', progress: 45 },
        { name: 'Machine Learning 101', progress: 20 },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    const learningPaths = studentData.learningPaths?.length > 0 ? studentData.learningPaths : exampleLearningPaths;

    return (
        <div className="student-dashboard p-8 bg-gray-50 min-h-screen">
            <nav className="text-center py-4 mb-8">
                <h1 className="text-3xl font-semibold">Welcome, {studentData.studentName}</h1>
                <p className="text-gray-600">Track your progress on learning paths and courses.</p>
            </nav>

            {/* Learning Paths Section */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {learningPaths.map((path, index) => (
                        <div key={index} className="p-4 bg-white shadow rounded-lg">
                            <h3 className="text-xl font-semibold">{path.name}</h3>
                            <div className="relative pt-4">
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${path.progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-gray-600">{path.progress}% complete</span>
                            </div>
                            <p className="mt-2 text-gray-500">Next Module: {path.nextModule}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Courses Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exampleCourses.map((course, index) => (
                        <div key={index} className="p-4 bg-white shadow rounded-lg">
                            <h3 className="text-xl font-semibold">{course.name}</h3>
                            <div className="relative pt-4">
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-gray-600">{course.progress}% complete</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
