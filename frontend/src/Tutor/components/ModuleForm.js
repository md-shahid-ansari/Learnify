import React, { useState, useEffect } from 'react';
import LessonForm from './LessonForm'; // Lesson Component
import QuizForm from './QuizForm'; // Import the QuizForm component

const ModuleForm = ({ index, module, onModuleChange, handleRemoveModule }) => {
    const [moduleData, setModuleData] = useState({
        _id: module._id || '',
        title: module.title || '',
        description: module.description || '',
        lessons: module.lessons || [],
        quizzes: module.quizzes || []
    });

    // Sync the local state with the incoming module prop
    useEffect(() => {
        setModuleData({
            _id: module._id,
            title: module.title || '',
            description: module.description || '',
            lessons: module.lessons || [],
            quizzes: module.quizzes || []
        });
    }, [module]);

    const handleAddLesson = () => {
        const newLesson = {_id: '', title: '', description: '', topics: [] };
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

    const handleAddQuiz = () => {
        const newQuiz = {_id: '', title: '', questions: [] };
        const updatedQuizzes = [...(moduleData.quizzes || []), newQuiz];
        const updatedModuleData = { ...moduleData, quizzes: updatedQuizzes };

        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    const handleRemoveQuiz = (quizIndex) => {
        const updatedQuizzes = moduleData.quizzes.filter((_, i) => i !== quizIndex);
        const updatedModuleData = { ...moduleData, quizzes: updatedQuizzes };

        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    const handleTitleChange = (e) => {
        const title = e.target.value || ''; // Default to empty string
        const updatedModuleData = { ...moduleData, title };
        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    const handleDescriptionChange = (e) => {
        const description = e.target.value || ''; // Default to empty string
        const updatedModuleData = { ...moduleData, description };
        setModuleData(updatedModuleData);
        onModuleChange(index, updatedModuleData); // Update parent
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-l font-semibold mb-2">Module {index + 1}</h4>
                <button
                    type="button"
                    onClick={() => handleRemoveModule(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    ×
                </button>
            </div>
            <input
                type="text"
                value={moduleData.title} // Controlled input
                onChange={handleTitleChange}
                placeholder="Module Title"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
            />
            <textarea
                value={moduleData.description} // Controlled input
                onChange={handleDescriptionChange}
                placeholder="Module Description"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
            />

            {/* Render Lesson Components */}
            <h2 className="text-lg font-bold mb-4">Lessons</h2>
            {(moduleData.lessons || []).map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="mb-4">
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
                        handleRemoveLesson={handleRemoveLesson}
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddLesson}
                className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Lesson
            </button>

            {/* Render Quiz Components */}
            <h2 className="text-lg font-bold mb-4">Quizzes</h2>
            {(moduleData.quizzes || []).map((quiz, quizIndex) => (
                <div key={quizIndex} className="mb-4">
                    <QuizForm
                        index={quizIndex}
                        quiz={quiz}
                        onQuizChange={(i, updatedQuiz) => {
                            const updatedQuizzes = moduleData.quizzes.map((q, idx) =>
                                idx === i ? updatedQuiz : q
                            );
                            const updatedModuleData = { ...moduleData, quizzes: updatedQuizzes };

                            setModuleData(updatedModuleData);
                            onModuleChange(index, updatedModuleData); // Update parent
                        }}
                        handleRemoveQuiz={handleRemoveQuiz}
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddQuiz}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Add Quiz
            </button>
        </div>
    );
};

export default ModuleForm;
