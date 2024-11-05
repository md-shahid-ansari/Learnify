import React, { useState } from 'react';

const CourseSidebar = ({ course, onLessonSelect, onQuizSelect }) => {
    return (
        <div className="w-64 bg-gray-800 text-white p-4 space-y-4">
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-300 mb-4">{course.description}</p>
            {course.modules.map((module) => (
                <div key={module._id} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">{module.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{module.description}</p>
                    <div className="space-y-2">
                        <button className="w-full text-left bg-gray-700 p-2 rounded">Lessons</button>
                        <ul className="space-y-1">
                            {module.lessons.map((lesson, index) => (
                                <li
                                    key={lesson._id}
                                    onClick={() => onLessonSelect(module, index)}
                                    className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                                >
                                    {lesson.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-2 space-y-2">
                        <button className="w-full text-left bg-gray-700 p-2 rounded">Quizzes</button>
                        <ul className="space-y-1">
                            {module.quizzes.map((quiz, index) => (
                                <li
                                    key={quiz._id}
                                    onClick={() => onQuizSelect(module, index)}
                                    className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                                >
                                    {quiz.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};


const CourseContent = ({ selectedLesson, selectedQuiz, handleNavigation }) => {
    return (
        <div className="flex-1 bg-white p-6 space-y-4">
            {selectedLesson ? (
                <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                    <p>{selectedLesson.description}</p>
                    {/* Render additional lesson content here */}
                </div>
            ) : selectedQuiz ? (
                <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
                    {/* Render additional quiz content here */}
                </div>
            ) : (
                <p className="text-gray-500">Select a lesson or quiz to start</p>
            )}

            {/* Navigation buttons */}
            <div className="flex space-x-4 mt-6">
                <button
                    onClick={() => handleNavigation('previous')}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Previous
                </button>
                <button
                    onClick={() => handleNavigation('next')}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};


const CourseViewer = ({ course }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
    const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);

    const handleLessonSelect = (module, lessonIndex) => {
        setSelectedModule(module);
        setSelectedLessonIndex(lessonIndex);
        setSelectedQuizIndex(null);
    };

    const handleQuizSelect = (module, quizIndex) => {
        setSelectedModule(module);
        setSelectedQuizIndex(quizIndex);
        setSelectedLessonIndex(null);
    };

    const handleNavigation = (direction) => {
        if (!selectedModule) return;

        if (selectedLessonIndex !== null) {
            const lessons = selectedModule.lessons;
            let newIndex = direction === "next" ? selectedLessonIndex + 1 : selectedLessonIndex - 1;
            newIndex = (newIndex + lessons.length) % lessons.length;
            setSelectedLessonIndex(newIndex);
            setSelectedQuizIndex(null);
        } else if (selectedQuizIndex !== null) {
            const quizzes = selectedModule.quizzes;
            let newIndex = direction === "next" ? selectedQuizIndex + 1 : selectedQuizIndex - 1;
            newIndex = (newIndex + quizzes.length) % quizzes.length;
            setSelectedQuizIndex(newIndex);
            setSelectedLessonIndex(null);
        }
    };

    return (
        <div className="flex h-screen">
            <CourseSidebar 
                course={course} 
                onLessonSelect={handleLessonSelect} 
                onQuizSelect={handleQuizSelect} 
            />
            <CourseContent 
                selectedLesson={selectedModule && selectedLessonIndex !== null ? selectedModule.lessons[selectedLessonIndex] : null}
                selectedQuiz={selectedModule && selectedQuizIndex !== null ? selectedModule.quizzes[selectedQuizIndex] : null}
                handleNavigation={handleNavigation} 
            />
        </div>
    );
};

export default CourseViewer;

