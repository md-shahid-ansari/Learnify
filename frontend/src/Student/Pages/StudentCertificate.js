import React, { useEffect, useState } from 'react';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const StudentCertificate = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated, studentData } = await IsStudentSessionLive();

            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
            fetchCertificates(studentData._id);
            setLoading(false);
        };

        authenticate();
    }, [navigate]);

    const fetchCertificates = async (studentId) => {
        try {
            const response = await axios.post(`${URL}/api/auth/certificates`, { studentId });

            if (response.data.success) {
                setCertificates(response.data.certificates);
                console.log(response.data.certificates);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        }
    };

    if (loading)
        return (
            <p className="text-center text-blue-500 text-xl font-semibold animate-pulse mt-10">
                Loading...
            </p>
        );

    return (
        <div className="w-full p-8 bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-10">Certificates</h1>
            <div>
                {certificates.map((certificate) => (
                    <div
                    key={certificate._id}
                    className="relative p-8 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden w-full h-[calc(100vh)] aspect-video"
                >
                    {/* Colorful Decorative Background with Gradient and Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-60 pointer-events-none rounded-xl animate-pulse"></div>
                
                    {/* Inner Border with Soft Glow */}
                    <div className="absolute inset-0 rounded-xl border-4 border-purple-600 opacity-80 blur-xl"></div>
                
                    {/* Light Pattern Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-50 pointer-events-none"></div>
                
                    {/* Certificate Title and Description */}
                    <div className="relative text-center mb-12">
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-500 uppercase tracking-wider">
                            {certificate.title}
                        </h2>
                        <p className="text-lg text-gray-500 mt-4">{certificate.description}</p>
                    </div>
                
                    {/* Course Information with Elegant Card-like Design */}
                    <div className="mt-8 text-gray-700">
                        <p className="text-xl font-semibold text-gray-800">
                            <strong>Course:</strong> {certificate.course.title}
                        </p>
                    </div>
                
                    {/* Tutor and Issued to Information */}
                    <div className="relative flex justify-between items-center mt-8 text-gray-700">
                        <p className="text-md font-medium">
                            <strong>Tutor:</strong> {certificate.tutor.name}
                        </p>
                        <p className="text-md font-medium">
                            <strong>Issued to:</strong> {certificate.earnedBy.name}
                        </p>
                    </div>
                
                    {/* Date Earned with Soft Gradient Accent */}
                    <div className="relative text-center mt-6 text-gray-700">
                        <p className="text-md font-medium"><strong>Date Earned:</strong> {new Date(certificate.dateEarned).toLocaleDateString()}</p>
                    </div>
                
                </div>
                
                ))}
            </div>
        </div>
    );
};

export default StudentCertificate;
