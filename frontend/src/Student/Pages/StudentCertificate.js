import React, { useState, useEffect } from 'react';

const StudentCertificate = () => {
    const [certificates, setCertificates] = useState([]);

    // Simulate fetching certificates from an API
    useEffect(() => {
        const fetchCertificates = async () => {
            const exampleCertificates = [
                {
                    title: "Front-End Developer Certification",
                    description: "Certification awarded for mastering front-end development skills, including HTML, CSS, and JavaScript.",
                    date: "July 2023",
                    issuedBy: "FreeCodeCamp",
                },
                {
                    title: "Full-Stack Developer Certification",
                    description: "Recognition for completing full-stack development training, covering both front-end and back-end skills.",
                    date: "September 2023",
                    issuedBy: "Coursera",
                },
                {
                    title: "React Advanced Concepts",
                    description: "Certificate awarded for expertise in React, Redux, and component-based architecture.",
                    date: "October 2023",
                    issuedBy: "Udemy",
                },
            ];

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setCertificates(exampleCertificates);
        };

        fetchCertificates();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Certificates</h1>
            <div className="space-y-6">
                {certificates.map((certificate, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700">{certificate.title}</h2>
                        <p className="text-gray-500 mt-2">{certificate.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-600">Issued By: {certificate.issuedBy}</span>
                            <span className="text-sm text-gray-600">Date: {certificate.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCertificate;
