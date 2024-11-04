import React, { useState, useEffect } from 'react';
import ModuleForm from './ModuleForm';  // Import the ModuleForm component

const CourseForm = ({ course, onCourseChange }) => {
    const [courseData, setCourseData] = useState({
        _id: course._id || '',
        title: course.title || '',
        description: course.description || '',
        modules: course.modules || []
    });

    // Sync local state with the incoming course prop
    useEffect(() => {
        setCourseData({
            _id: course._id || '',
            title: course.title || '',
            description: course.description || '',
            modules: course.modules || []
        });
    }, [course]);

    // Helper function to handle title, description, and modules changes
    const handleInputChange = (field, value) => {
        const updatedCourseData = { ...courseData, [field]: value };
        setCourseData(updatedCourseData);
        onCourseChange(updatedCourseData); // Update course state in parent component
    };

    // Add a new module
    const handleAddModule = () => {
        const newModule = {_id: '', title: '', description: '', lessons: [], quizzes: [] };
        const updatedModules = [...courseData.modules, newModule];
        handleInputChange("modules", updatedModules);
    };

    // Remove a module by index
    const handleRemoveModule = (moduleIndex) => {
        const updatedModules = courseData.modules.filter((_, i) => i !== moduleIndex);
        handleInputChange("modules", updatedModules);
    };

    // Update a specific module by index
    const handleModuleChange = (moduleIndex, updatedModule) => {
        const updatedModules = courseData.modules.map((mod, i) =>
            i === moduleIndex ? updatedModule : mod
        );
        handleInputChange("modules", updatedModules);
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4">Course Details</h3>
            
            {/* Course Title Input */}
            <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Course Title"
                className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            
            {/* Course Description Textarea */}
            <textarea
                value={courseData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Course Description"
                className="w-full mb-4 px-3 py-2 border rounded-md"
            />

            {/* Module Section */}
            <h2 className="text-lg font-bold mb-4">Modules</h2>
            {courseData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="mb-4">
                    <ModuleForm
                        index={moduleIndex}
                        module={module}
                        onModuleChange={(idx, updatedModule) => handleModuleChange(moduleIndex, updatedModule)}
                        handleRemoveModule={handleRemoveModule}
                    />
                </div>
            ))}

            {/* Add Module Button */}
            <button
                type="button"
                onClick={handleAddModule}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Add Module
            </button>
        </div>
    );
};

export default CourseForm;
