import React, { useEffect, useState } from 'react';
import CourseForm from '../components/CourseForm'; // Course component to handle the course-level actions
import { IsTutorSessionLive } from '../utils/IsTutorSessionLive';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast} from '../../Toast/toasts';


const TutorCourse = () => {
    const [course, setCourse] = useState({ title: '', description: '', modules: [], certificate: null });
    const [isCourseCreated, setIsCourseCreated] = useState(false);
    const [certificate, setCertificate] = useState({ title: '', description: '' });
    const [isCertificateFieldVisible, setIsCertificateFieldVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate= async () => {
            const { isAuthenticated } = await IsTutorSessionLive();
      
            if (!isAuthenticated) {
              showErrorToast('You are not authenticated. Please log in again.');
              navigate('/login-page');
              setLoading(false);
              return;
            }
            setLoading(false);
        };
        authenticate();
    });

    const handleAddCourse = () => {
        setIsCourseCreated(true); // Set to true when creating a course
    };

    const onCourseChange = (updatedCourse) => {
        setCourse(updatedCourse);
    };

    const handleCertificateChange = (e) => {
        const { name, value } = e.target;
        const updatedCertificate = {
            ...certificate,
            [name]: value
        };
        setCertificate(updatedCertificate);
        setCourse((prevCourse) => ({
            ...prevCourse,
            certificate: updatedCertificate
        }));
    };

    const toggleCertificateField = () => {
        setIsCertificateFieldVisible((prevVisible) => !prevVisible);
        if (isCertificateFieldVisible) {
            // Reset certificate when hiding the fields
            setCertificate({ title: '', description: '' });
            setCourse((prevCourse) => ({ ...prevCourse, certificate: null }));
        }
    };


    const isObject = (value) => value && typeof value === "object" && !Array.isArray(value) && !(value instanceof File);

    const findEmptyFields = (obj, path = "") => {
        let emptyFields = [];

        for (let key in obj) {
            const currentPath = path ? `${path}.${key}` : key;

            // Skip fields that are `File` objects without specific validation
            if (obj[key] instanceof File) {
                if (obj[key].size === 0) {
                    emptyFields.push(currentPath); // Add to emptyFields if file is empty
                }
                continue;
            }

            // Check for null, undefined, or empty string values
            if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
                emptyFields.push(currentPath);
            } else if (isObject(obj[key]) || Array.isArray(obj[key])) {
                emptyFields = emptyFields.concat(findEmptyFields(obj[key], currentPath));
            }
        }

        return emptyFields;
    };

    const handleSubmit = () => {
        if (!course.title || !course.description) { 
            showErrorToast("Please provide course title and description.");
            return;
        }

        const emptyFields = findEmptyFields(course);
        if (emptyFields.length > 0) {
            showErrorToast(`Please fill out the following fields:\n- ${emptyFields.join("\n- ")}`);
            return;
        }

        console.log("Course submitted:", course);
        showSuccessToast("Course submitted successfully!");
        // You can also make a POST request to a server here with the course data.
    };





    const handleCancel = () => {
        setIsCourseCreated(false); // Hide form and submit button
        setCourse({ title: '', description: '', modules: [], certificate: null }); // Reset the course state
        setCertificate({ title: '', description: '' });
        setIsCertificateFieldVisible(false);
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
                <h2 className="text-xl font-bold mb-4">Courses</h2>
                {!isCourseCreated && (
                    <button 
                        onClick={handleAddCourse} 
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Create Course
                    </button>
                )}
            </div>

            
            {isCourseCreated && (
                <div className="p-4 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
                    {/* Course Form */}
                    <CourseForm 
                        course={course} 
                        onCourseChange={onCourseChange} 
                    />

                    {/* Certificate Section */}
                    <h3 className="text-lg font-semibold mb-2">Certificate</h3>
                    {!isCertificateFieldVisible ? (
                        <button
                            onClick={toggleCertificateField}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Add Certificate
                        </button>
                    ) : (
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={certificate.title}
                                onChange={handleCertificateChange}
                                placeholder="Certificate Title"
                                className="mb-2 px-3 py-1 border rounded w-full"
                            />
                            <textarea
                                name="description"
                                value={certificate.description}
                                onChange={handleCertificateChange}
                                placeholder="Certificate Description"
                                className="mb-2 px-3 py-1 border rounded w-full"
                            />
                            <button
                                onClick={toggleCertificateField}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove Certificate
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Submit and Cancel Buttons */}
            {isCourseCreated && (
                <div className="flex space-x-4 mt-6">
                    <button 
                        onClick={handleSubmit} 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Submit Course
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default TutorCourse;
