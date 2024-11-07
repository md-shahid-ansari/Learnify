// StudentCourseViewer.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import CourseViewer from '../components/CourseViewer';

const StudentCourseViewer = () => {
    const location = useLocation();
    const { course } = location.state || {};

    return (
        <div className="bg-gray-100 min-h-screen">
            {course ? (
                <CourseViewer course={course} />
            ) : (
                <p className="text-gray-700 text-center">No course data available</p>
            )}
        </div>
    );
};

export default StudentCourseViewer;
