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

    
    const printCertificate = (certificateId) => {
        const certificateElement = document.getElementById(`certificate-${certificateId}`);
        const certificateClone = certificateElement.cloneNode(true); // Clone the certificate content
    
        // Find and remove the download button from the cloned content
        const downloadButton = certificateClone.querySelector('button');
        if (downloadButton) {
            downloadButton.remove();
        }
    
        const newWindow = window.open('', '_blank', 'width=800,height=600');
    
        // Open HTML document for the new window
        newWindow.document.write('<html><head><title>Certificate</title>');
    
        // Link to the Tailwind CSS
        newWindow.document.write(
            '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">'
        );
    
        // Append any additional styles from the original document
        Array.from(document.styleSheets).forEach((styleSheet) => {
            if (styleSheet.href) {
                newWindow.document.write(`<link rel="stylesheet" type="text/css" href="${styleSheet.href}">`);
            }
        });
    
        newWindow.document.write('</head><body>');
        newWindow.document.write(certificateClone.outerHTML); // Write the cloned content without the button
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    
        // Trigger print
        newWindow.print();
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
                        id={`certificate-${certificate._id}`}
                        className="relative p-8 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden w-full h-[calc(100vh)] aspect-video"
                    >

                        {/* Certificate Content */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-60 pointer-events-none rounded-xl animate-pulse"></div>
                        
                        <div className="absolute inset-0 rounded-xl border-4 border-purple-600 opacity-80 blur-xl"></div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-50 pointer-events-none"></div>
                        
                        <div className="flex flex-wrap justify-between mt-2 ml-2">
                            <div className="text-xl font-semibold text-gray-1000 tracking-wider">
                                Learnify - By Academix
                            </div>
                            <div className="text-xl font-semibold text-gray-1000 tracking-wider">
                                Certificate Id : {certificate._id}
                            </div>
                        </div>
                    
                        <div className="relative text-center mt-10 mb-12">
                            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-500 uppercase tracking-wide">
                                {certificate.title}
                            </h2>
                        </div>
                    
                        <div className="relative text-center text-gray-700 mb-16 px-10">
                            <p className="text-xl leading-relaxed font-light italic">
                                This certificate is awarded to <span className="font-semibold">{certificate.earnedBy.name}</span> in recognition of their successful completion of the course <span className="font-semibold">{certificate.course.title}</span>. Presented with appreciation under the guidance of <span className="font-semibold">{certificate.tutor.name}</span>, who has mentored throughout the learning journey.
                            </p>
                        </div>
                    
                        <div className="flex flex-wrap justify-between text-left text-gray-700 mt-12 ml-8">
                            <p className="text-xl font-semibold text-gray-800 mb-4">
                                <strong>Course:</strong> {certificate.course.title}
                            </p>
                            <p className="text-xl font-semibold text-gray-800 mb-4">
                                <strong>Issued to:</strong> {certificate.earnedBy.name}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between text-left text-gray-700 mt-4 ml-8">
                            <p className="text-xl font-semibold text-gray-800 mb-4">
                                <strong>Tutor:</strong> {certificate.tutor.name}
                            </p>
                            <p className="text-xl font-semibold text-gray-800 mb-4">
                                <strong>Date Earned:</strong> {new Date(certificate.dateEarned).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={() => printCertificate(certificate._id)}
                            className="absolute bottom-8 right-8 text-gray-600 bg-gray-300 hover:bg-gray-200 p-1 rounded"
                            aria-label="Download Certificate"
                        >
                            <i className="fas fa-download text-gray-700 text-3xl"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCertificate;
