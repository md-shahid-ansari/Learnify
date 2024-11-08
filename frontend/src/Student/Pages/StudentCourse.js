import React, { useEffect, useState } from 'react';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';
import { useNavigate } from 'react-router-dom';
import { showErrorToast} from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const StudentCourse = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated, studentData} = await IsStudentSessionLive();

            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
            fetchEnrollments(studentData._id);
            setLoading(false);
        };
    
        authenticate();
    }, [navigate]); // Only depend on navigate
    
    const fetchEnrollments = async (studentId) => {
        try {
            const response = await axios.post(`${URL}/api/auth/enrollments`,{
                studentId
            });
    
            if (response.data.success) {
                setEnrollments(response.data.enrollments);
                console.log(response.data.enrollments)
            }            
        } catch (error) {
            console.error("Error fetching enrollments:", error);
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
        <div className="p-6 space-y-6">
        {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="p-6 border border-gray-300 rounded-lg shadow-md">
            {/* Course Title and Description */}
            <h2 className="text-2xl font-bold mb-2">{enrollment.courseId.title}</h2>
            <p className="text-gray-700 mb-4">{enrollment.courseId.description}</p>

            {/* Certificate Information */}
            {enrollment.courseId.certificate && (
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                <h4 className="text-xl font-semibold">Certificate: {enrollment.courseId.certificate.title}</h4>
                <p className="text-gray-600">{enrollment.courseId.certificate.description}</p>
                </div>
            )}

            {/* Progress */}
            <div className="mt-4">
            <p className="text-gray-600 mb-2">Progress: {enrollment.progress}%</p>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${enrollment.progress}%` }}
                ></div>
            </div>
            </div>


            {/* Edit/View Button */}
            <div className="flex space-x-4 mt-2">
                <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => navigate("/student-home/student-course-view", { state: { enrollment } })}
                >
                Read
                </button>
            </div>
            </div>
        ))}
        </div>
    );
};

export default StudentCourse;
