import React, { useState, useEffect } from 'react';
import LessonForm from './LessonForm'; // Lesson Component

const ModuleForm = ({ index, module, onModuleChange }) => {
    const [moduleData, setModuleData] = useState(module);

    // Sync the local state with the incoming module prop
    useEffect(() => {
        setModuleData(module);
    }, [module]);

    const handleAddLesson = () => {
        const newLesson = { title: '', description: '', topics: [], quizzes: [] };
        const updatedLessons = [...(moduleData.lessons || []), newLesson];
        const updatedModuleData = { ...moduleData, lessons: updatedLessons };

        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    const handleRemoveLesson = (lessonIndex) => {
        const updatedLessons = moduleData.lessons.filter((_, i) => i !== lessonIndex);
        const updatedModuleData = { ...moduleData, lessons: updatedLessons };

        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    return (
        <div>
            <h4>Module {index + 1}</h4>
            <input
                type="text"
                value={moduleData.title}
                onChange={(e) => {
                    const updatedModuleData = { ...moduleData, title: e.target.value };
                    setModuleData(updatedModuleData);
                    onModuleChange(index, updatedModuleData); // Update parent
                }}
                placeholder="Module Title"
            />
            <textarea
                value={moduleData.description}
                onChange={(e) => {
                    const updatedModuleData = { ...moduleData, description: e.target.value };
                    setModuleData(updatedModuleData);
                    onModuleChange(index, updatedModuleData); // Update parent
                }}
                placeholder="Module Description"
            />

            {/* Render Lesson Components */}
            {(moduleData.lessons || []).map((lesson, lessonIndex) => (
                <div key={lessonIndex}>
                    <LessonForm
                        index={lessonIndex}
                        lesson={lesson}
                        onLessonChange={(i, updatedLesson) => {
                            const updatedLessons = moduleData.lessons.map((l, idx) =>
                                idx === i ? updatedLesson : l
                            );
                            const updatedModuleData = { ...moduleData, lessons: updatedLessons };

                            setModuleData(updatedModuleData);
                            onModuleChange(index, updatedModuleData); // Update parent
                        }}
                    />
                    <button type="button" onClick={() => handleRemoveLesson(lessonIndex)}>
                        Remove Lesson
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAddLesson}>Add Lesson</button>
        </div>
    );
};

export default ModuleForm;
