import React, { useEffect, useState } from 'react';
import CourseForm from '../components/CourseForm'; // Course component to handle the course-level actions
import { IsTutorSessionLive } from '../utils/IsTutorSessionLive';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast} from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const TutorCourse = () => {
    const [course, setCourse] = useState({_id: '', title: '', description: '', modules: [], certificate: { title: '', description: '' } });
    const [isCourseCreated, setIsCourseCreated] = useState(false);
    const [isCourseUpdated, setIsCourseUpdated] = useState(false);
    const [isShowForm, setIsShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [tutor, setTutor] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated, tutorData } = await IsTutorSessionLive();
    
            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
    
            if (tutorData) {
                setTutor(tutorData);
                // Now we will fetch courses only after setting the tutor
                fetchCourses(tutorData._id);
            }
    
            setLoading(false);
        };
    
        authenticate();
    }, [navigate]); // Only depend on navigate
    
    const fetchCourses = async (tutorId) => {
        try {
            const response = await axios.post(`${URL}/api/auth/fetch-courses`, {
                tutorId
            });
    
            if (response.data.success) {
                setCourses(response.data.courses);
                // console.log(response.data.courses); // Log fetched courses
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            const response = await axios.post(`${URL}/api/auth/delete-course`, {
                courseId
            });
    
            if (response.data.success) {
                fetchCourses(tutor._id);
                showSuccessToast("Course deleted successfully");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };
    

    const handleAddCourse = () => {
        setIsCourseCreated(true); // Set to true when creating a course
        setIsShowForm(true);
    };

    const onCourseChange = (updatedCourse) => {
        setCourse(updatedCourse);
    };

    const handleCertificateChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            certificate: {
                ...prevCourse.certificate,
                [name]: value
            }
        }));
    };
    



    const isObject = (value) => value && typeof value === "object" && !Array.isArray(value) && !(value instanceof File);

    const findEmptyFields = (obj, path = "") => {
        let emptyFields = [];

        for (let key in obj) {
            // Skip the `_id` field
            if (key === "_id") continue;

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

    const uploadImage = async (file) => {
        let fileId = '';
        let fileName = '';
        if (file) {
        const formDataFile = new FormData();
        formDataFile.append('file', file); // Ensure the field name matches 'uploadTestResult'
    
        try {
            const response = await axios.post(`${URL}/api/auth/upload-image`, formDataFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            fileId = response.data.file.id;
            fileName = response.data.file.filename;
        } catch (error) {
            console.error('Error uploading file:', error);
            showErrorToast('Error uploading file. Please try again.');
            return;
        }
        }
        return { fileId, fileName };
    }

    const handleSubmit = async () => {
        if (!course.title || !course.description) { 
            showErrorToast("Please provide course title and description.");
            return;
        }
        
        const emptyFields = findEmptyFields(course);
        if (emptyFields.length > 0) {
            showErrorToast(`Please fill out the following fields:\n- ${emptyFields.join("\n- ")}`);
            return;
        }

        try {
            // Iterate through each image and upload it
            for (let module of course.modules) {
                for (let lesson of module.lessons) {
                    for (let topic of lesson.topics) {
                        for (let image of topic.images) {
                            if (image.file) {
                                const uploadedImage = await uploadImage(image.file);
                                image.filename = uploadedImage.fileName;
                                image.fileId = uploadedImage.fileId;
                                delete image.file; // Remove the raw file data to avoid re-uploading
                            }
                        }
                    }
                }
            }
            
            // now send the course data.
            const response = await axios.post(`${URL}/api/auth/create-course`, {
                course : course,
                tutorId: tutor._id
            });
      
            if (response.data.success) {
                showSuccessToast("Course created successfully!");
                fetchCourses(tutor._id);
                //close the form
                handleCancel();
            } else {
                showErrorToast("Course creation failed!");
            }
          } catch (err) {
            // Handle different error cases
            if (err.response) {
                showErrorToast(err.response.error || 'Something went wrong.');
            } else {
                showErrorToast('Server is not responding.');
            }
          }
    };

    const handleUpdate = async () => {
        if (!course.title || !course.description) { 
            showErrorToast("Please provide course title and description.");
            return;
        }
        
        const emptyFields = findEmptyFields(course);
        if (emptyFields.length > 0) {
            showErrorToast(`Please fill out the following fields:\n- ${emptyFields.join("\n- ")}`);
            return;
        }
    
        try {
            // Iterate through each image and upload if not uploaded already
            for (let module of course.modules) {
                for (let lesson of module.lessons) {
                    for (let topic of lesson.topics) {
                        for (let image of topic.images) {
                            if (image.file) {
                                const uploadedImage = await uploadImage(image.file);
                                image.filename = uploadedImage.fileName;
                                image.fileId = uploadedImage.fileId;
                                delete image.file;
                            }
                        }
                    }
                }
            }
    
            // Send the updated course data to backend
            const response = await axios.post(`${URL}/api/auth/update-course`, {
                course: course,
                tutorId: tutor._id,
            });
    
            if (response.data.success) {
                showSuccessToast("Course updated successfully!");
                fetchCourses(tutor._id);
                handleCancel();
            } else {
                showErrorToast("Course update failed!");
            }
        } catch (err) {
            if (err.response) {
                showErrorToast(err.response.error || 'Something went wrong.');
            } else {
                showErrorToast('Server is not responding.');
            }
        }
    };    


    const handleCancel = () => {
        setIsCourseCreated(false); // Hide form and submit button
        setCourse({ title: '', description: '', modules: [], certificate: { title: '', description: '' } }); // Reset the course state

        setIsCourseUpdated(false);
        setIsShowForm(false);
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
                {!isCourseCreated && !isCourseUpdated && (
                    <button 
                        onClick={handleAddCourse} 
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Create Course
                    </button>
                )}
            </div>

            
            {isShowForm && (
                <div className="p-4 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
                    {/* Course Form */}
                    <CourseForm 
                        course={course} 
                        onCourseChange={onCourseChange} 
                    />

                    {/* Certificate Section */}
                    <h3 className="text-lg font-semibold mb-2">Certificate</h3>
                    <div>
                        <input
                            type="text"
                            name="title"
                            value={course?.certificate?.title || ''}
                            onChange={handleCertificateChange}
                            placeholder="Certificate Title"
                            className="mb-2 px-3 py-1 border rounded w-full"
                        />
                        <textarea
                            name="description"
                            value={course?.certificate?.description || ''}
                            onChange={handleCertificateChange}
                            placeholder="Certificate Description"
                            className="mb-2 px-3 py-1 border rounded w-full"
                        />
                    </div>
                </div>
            )}

            {/* Submit and Cancel Buttons */}
            {isCourseCreated && (
                <div className="flex space-x-4 mt-6 mb-4">
                    <button 
                        onClick={handleSubmit} 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Submit Course
                    </button>
                    <button 
                        onClick={() => {
                            setIsCourseCreated(false);
                            setIsShowForm(false)
                        }} 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Update and Cancel Buttons */}
            {isCourseUpdated && (
                <div className="flex space-x-4 mt-6 mb-4">
                    <button 
                        onClick={handleUpdate} 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Update Course
                    </button>
                    <button 
                        onClick={() => {
                            setIsCourseUpdated(false);
                            setIsShowForm(false)
                        }} 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* All courses */}
            {!isShowForm && (
                <>
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
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onClick={() => {
                                setCourse(course);
                                setIsCourseUpdated(true);
                                setIsShowForm(true);
                            }}>
                                Edit Course
                            </button>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                View Course
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => deleteCourse(course._id)}>
                                Delete Course
                            </button>
                        </div>
                    </div>
                ))}
                </>
            )}
        </div>
    );
};

export default TutorCourse;
