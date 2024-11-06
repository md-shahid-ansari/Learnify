import React, { useState, useEffect } from 'react';

const CourseSidebar = ({ course, onLessonSelect, onQuizSelect, isOpen }) => (
    <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-800 text-white p-4 space-y-4 transition-transform duration-300 overflow-y-auto z-20`}
    >
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

const CourseContent = ({ selectedLesson, selectedQuiz, handleNavigation }) => (
    <div className="flex-1 p-6 overflow-y-auto">
        {selectedLesson ? (
            <div>
                <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                <p>{selectedLesson.description}</p>
            </div>
        ) : selectedQuiz ? (
            <div>
                <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
            </div>
        ) : (
            <p className="text-gray-500">Select a lesson or quiz to start</p>
        )}
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

const CourseViewer = ({ course }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
    const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 730);

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
            let newIndex = direction === 'next' ? selectedLessonIndex + 1 : selectedLessonIndex - 1;
            newIndex = (newIndex + lessons.length) % lessons.length;
            setSelectedLessonIndex(newIndex);
            setSelectedQuizIndex(null);
        } else if (selectedQuizIndex !== null) {
            const quizzes = selectedModule.quizzes;
            let newIndex = direction === 'next' ? selectedQuizIndex + 1 : selectedQuizIndex - 1;
            newIndex = (newIndex + quizzes.length) % quizzes.length;
            setSelectedQuizIndex(newIndex);
            setSelectedLessonIndex(null);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Auto-hide sidebar on smaller screens
    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 730);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="pt-16 h-screen flex relative">
            <CourseSidebar
                course={course}
                onLessonSelect={handleLessonSelect}
                onQuizSelect={handleQuizSelect}
                isOpen={isSidebarOpen}
            />
            {/* Toggle button positioned to the right of the sidebar */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-16 ${isSidebarOpen ? 'left-64' : 'left-0'} z-30 bg-transparent text-dark pt-4 pr-1 pb-1 pl-1 focus:outline-none transition-all duration-300`}
            >
                {isSidebarOpen ? '◐' : '◑'}
            </button>
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <CourseContent
                    selectedLesson={selectedModule && selectedLessonIndex !== null ? selectedModule.lessons[selectedLessonIndex] : null}
                    selectedQuiz={selectedModule && selectedQuizIndex !== null ? selectedModule.quizzes[selectedQuizIndex] : null}
                    handleNavigation={handleNavigation}
                />
            </main>
        </div>
    );
};

export default CourseViewer;
