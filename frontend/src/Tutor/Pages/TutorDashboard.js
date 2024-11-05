import React, { useEffect, useState } from 'react';
import { IsTutorSessionLive } from '../utils/IsTutorSessionLive';
import { useNavigate } from 'react-router-dom';
import { showErrorToast} from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const TutorDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated} = await IsTutorSessionLive();

            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
            fetchCourses();
            setLoading(false);
        };
    
        authenticate();
    }, [navigate]); // Only depend on navigate
    
    const fetchCourses = async () => {
        try {
            const response = await axios.post(`${URL}/api/auth/courses`);
    
            if (response.data.success) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Return loading spinner or error message as needed
    if (loading) 
        return (
        <p className="text-center text-blue-500 text-xl font-semibold animate-pulse mt-10">
            Loading...
        </p>
        );

    return (
        <div className="p-4">
            {/* Create Course Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Courses</h2>
            </div>
            {/* All courses */}
              <div>
                {courses.map((course, index) => (
                    <div key={index} className="bg-white p-4 rounded mb-4 shadow-md">
                        <h2 className="text-lg font-bold mb-2">{course.title}</h2>
                        <p className="mb-2">{course.description}</p>

                        {/* Display modules for the course */}
                        {course.modules && course.modules.length > 0 && (
                            <div className="mb-2">
                                <h3 className="font-semibold">Modules:</h3>
                                <ul className="list-disc list-inside">
                                    {course.modules.map((module, moduleIndex) => (
                                        <li key={moduleIndex} className="ml-4">
                                            {module.title}
                                            {/* Display lessons within each module */}
                                            {module.lessons && module.lessons.length > 0 && (
                                                <ul className="list-decimal list-inside ml-4">
                                                    {module.lessons.map((lesson, lessonIndex) => (
                                                        <li key={lessonIndex}>{lesson.title}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Edit/View Button - add functionality as needed */}
                        <div className="flex space-x-4 mt-2">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => navigate("/tutor-home/tutor-course-view", { state: { course } })}>
                                View Course
                            </button>
                        </div>
                    </div>
                ))}
              </div>
        </div>
    );
};

export default TutorDashboard;
