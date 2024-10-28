import React, { useState } from 'react';
import CourseForm from '../components/CourseForm'; // Course component to handle the course-level actions

const TutorCourse = () => {
    const [course, setCourse] = useState({ title: '', description: '', modules: [] });
    const [isCourseCreated, setIsCourseCreated] = useState(false);

    const handleAddCourse = () => {
        setIsCourseCreated(true); // Set to true when creating a course
    };

    const onCourseChange = (updatedCourse) => {
        setCourse(updatedCourse);
    };

    const handleSubmit = () => {
        if (!course.title || !course.description) {
            alert("Please provide course title and description.");
            return;
        }

        console.log("Course submitted:", course);
        alert("Course submitted successfully!");
        // You can also make a POST request to a server here with the course data.
    };

    const handleCancel = () => {
        setIsCourseCreated(false); // Hide form and submit button
        setCourse({ title: '', description: '', modules: [] }); // Reset the course state
    };

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

            {/* Course Form */}
            {isCourseCreated && (
                <div className="mb-4">
                    <CourseForm 
                        course={course} 
                        onCourseChange={onCourseChange} 
                    />
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
