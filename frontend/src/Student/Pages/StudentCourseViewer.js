import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CourseViewer from '../components/CourseViewer';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const StudentCourseViewer = () => {
    const location = useLocation();
    const { enrollment } = location.state || {};
    const [course, setCourse] = useState(null);

    const fetchCourse = async () => {
        try {
            const response = await axios.post(`${URL}/api/auth/course`, {
                courseId: enrollment.courseId
            });

            if (response.data.success) {
                setCourse(response.data.course);
                console.log(response.data.course);  // Log extracted course data
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        if (enrollment && enrollment.courseId) {
            fetchCourse(); // Fetch the course when enrollment is available
        }
    }, [enrollment]);

    return (
        <div className="bg-gray-100 min-h-screen">
            {course ? (
                <CourseViewer 
                    course={course[0]} 
                    enrollment={enrollment}
                />
            ) : (
                <p className="text-gray-700 text-center">No course data available</p>
            )}
        </div>
    );
};

export default StudentCourseViewer;
