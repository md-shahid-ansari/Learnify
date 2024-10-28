import React, { useState } from 'react';
import ModuleForm from './ModuleForm';  // Module Component

const CourseForm = ({ index, course, onCourseChange }) => {
    const [courseData, setCourseData] = useState(course);

    const handleModuleChange = (moduleIndex, updatedModule) => {
        const updatedModules = courseData.modules.map((module, i) =>
            i === moduleIndex ? updatedModule : module
        );
        setCourseData({ ...courseData, modules: updatedModules });
        onCourseChange(index, { ...courseData, modules: updatedModules });
    };

    const handleAddModule = () => {
        const newModule = { title: '', description: '', topics: [], quizzes: [] };
        setCourseData({ ...courseData, modules: [...courseData.modules, newModule] });
    };

    const handleRemoveModule = (moduleIndex) => {
        const updatedModules = courseData.modules.filter((_, i) => i !== moduleIndex);
        setCourseData({ ...courseData, modules: updatedModules });
        onCourseChange(index, { ...courseData, modules: updatedModules });  // Update parent
    };

    return (
        <div>
            <h3>Course {index + 1}</h3>
            <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                placeholder="Course Title"
            />
            <textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                placeholder="Course Description"
            />

            {/* Render Module Components */}
            {courseData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex}>
                    <ModuleForm
                        index={moduleIndex}
                        module={module}
                        onModuleChange={handleModuleChange}
                    />
                    <button type="button" onClick={() => handleRemoveModule(moduleIndex)}>
                        Remove Module
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAddModule}>Add Module</button>
        </div>
    );
};

export default CourseForm;
