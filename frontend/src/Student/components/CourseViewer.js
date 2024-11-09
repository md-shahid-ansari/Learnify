import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {showErrorToast, showSuccessToast} from '../../Toast/toasts'

const URL = process.env.REACT_APP_BACKEND_URL;


// CourseSidebar Component
const CourseSidebar = ({ course, enrollment, onSelectStep, isOpen }) => (
    <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-800 text-white p-4 space-y-4 transition-transform duration-300 overflow-y-auto z-20 thin-scrollbar`}
    >
        <h2 className="text-xl font-bold mb-4">{course.title}</h2>
        <ProgressBar
            enrollment={enrollment}
        />
        {course.modules.map((module, moduleIdx) => (
            <div key={module._id} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{module.title}</h3>
                <div className="bg-gray-700 p-2 rounded-lg mb-2">
                    <button
                        className="w-full text-left text-gray-300 font-medium"
                        onClick={() => onSelectStep({ type: 'module', moduleIdx })}
                    >
                        Overview
                    </button>
                </div>
                <div className="bg-gray-600 p-2 rounded-lg mb-2">
                    <button className="w-full text-left text-gray-200 font-medium">Lessons</button>
                    <ul className="space-y-1 mt-2">
                        {module.lessons.map((lesson, lessonIdx) => (
                            <li
                                key={lesson._id}
                                onClick={() => onSelectStep({ type: 'lesson', moduleIdx, lessonIdx })}
                                className={`cursor-pointer p-2 rounded-md hover:bg-gray-500 
                                    ${enrollment.completedLessons.includes(lesson._id) ? "text-green-600 font-semibold" : ""}`}
                            >
                                {lesson.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-600 p-2 rounded-lg">
                    <button className="w-full text-left text-gray-200 font-medium">Quizzes</button>
                    <ul className="space-y-1 mt-2">
                        {module.quizzes.map((quiz, quizIdx) => (
                            <li
                                key={quiz._id}
                                onClick={() => onSelectStep({ type: 'quiz', moduleIdx, quizIdx })}
                                className={`cursor-pointer p-2 rounded-md hover:bg-gray-500 
                                    ${enrollment.completedQuizzes.includes(quiz._id) ? "text-green-600 font-semibold" : ""}`}
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


const TopicImage = ({ src, alt, title }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className="relative overflow-hidden bg-gray-300 rounded w-full h-auto" // Use responsive width
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span>Loading...</span>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                style={{ aspectRatio: 'auto' }} // Keeps the natural aspect ratio
            />
            <p className="text-sm mt-1 text-center">{title}</p>
        </div>
    );
};



// CourseContent Component
const CourseContent = ({ content , isShowAnsers , handleSubmitAnswers}) => {
    const renderContent = () => {
        if (!content) {
            return <p className="text-gray-500">Select a step to begin.</p>;
        }

        switch (content.type) {
            case 'course':
                return (
                    <div>
                        <h2 className="text-2xl font-bold">{content.title}</h2>
                        <p className="mt-2">{content.description}</p>
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                            <h3 className="text-xl font-semibold">Certificate</h3>
                            <p><strong>{content.certificate.title}</strong>: {content.certificate.description}</p>
                        </div>
                    </div>
                );
            case 'module':
                return (
                    <div>
                        <h2 className="text-2xl font-bold">{content.title}</h2>
                        <p className="mt-2">{content.description}</p>
                    </div>
                );
                case 'lesson':
                    return (
                        <div>
                            <h2 className="text-2xl font-bold">{content.title}</h2>
                            <p className="mt-2">{content.description}</p>
                            <h3 className="text-xl font-semibold mt-4">Topics</h3>
                            <ul className="space-y-4 mt-2">
                                {content.topics.map((topic) => (
                                    <li key={topic._id} className="p-4 bg-gray-100 rounded-md shadow">
                                        <h4 className="font-semibold text-lg">{topic.title}</h4>
                                        <p className="mt-2">{topic.content}</p>
                                        <h5 className="font-medium mt-4">Learning Outcomes:</h5>
                                        <ul className="list-disc list-inside">
                                            {topic.learningOutcomes.map((outcome, idx) => (
                                                <li key={idx}>{outcome}</li>
                                            ))}
                                        </ul>
                                        <div className="mt-4">
                                            {topic.images.map((image) => (
                                                <TopicImage key={image._id} src={image.previewUrl} alt={image.title} title={image.title} />
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            {topic.links.map((link) => (
                                                <div key={link._id} className="mt-2">
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {link.title}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
            case 'quiz':
                return (
                    <div>
                        <h2 className="text-2xl font-bold">{content.title}</h2>
                        <div className="mt-4 space-y-6">
                            {content.questions && content.questions.map((question, index) => (
                                <div key={question._id} className="p-4 bg-gray-100 rounded-md shadow">
                                    <p className="font-semibold">{index + 1}. {question.questionText}</p>
                                    {question.questionType === 'multiple-choice' && (
                                        <div className="mt-2 space-y-2">
                                            {question.options.map((option, idx) => (
                                                <label key={idx} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question._id}`} // Ensures only one option can be selected per question
                                                        value={option}
                                                        className="form-radio text-blue-600"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                            {isShowAnsers && (
                                                <div className="w-full mt-4 p-3 bg-green-50 border border-green-300 rounded-lg shadow-sm">
                                                    <label className="text-sm font-medium text-green-700">
                                                        Correct Answer: 
                                                    </label>
                                                    <span className="ml-2 text-green-800 font-semibold">
                                                        {question.correctAnswer}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {question.questionType === 'short-answer' && (
                                        <>
                                            <textarea
                                                placeholder="Your answer"
                                                className="w-full mt-2 p-2 border rounded"
                                            ></textarea>
                                            {isShowAnsers && (
                                                <div className="w-full mt-4 p-3 bg-green-50 border border-green-300 rounded-lg shadow-sm">
                                                    <label className="text-sm font-medium text-green-700">
                                                        Correct Answer: 
                                                    </label>
                                                    <span className="ml-2 text-green-800 font-semibold">
                                                        {question.correctAnswer}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {question.questionType === 'true/false' && (
                                        <div className="mt-2">
                                            <label className="mr-4">
                                                <input type="radio" name={`question-${index}`} value="true" className="mr-2" />
                                                True
                                            </label>
                                            <label>
                                                <input type="radio" name={`question-${index}`} value="false" className="mr-2" />
                                                False
                                            </label>
                                            {isShowAnsers && (
                                                <div className="w-full mt-4 p-3 bg-green-50 border border-green-300 rounded-lg shadow-sm">
                                                    <label className="text-sm font-medium text-green-700">
                                                        Correct Answer: 
                                                    </label>
                                                    <span className="ml-2 text-green-800 font-semibold">
                                                        {question.correctAnswer}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={handleSubmitAnswers}
                                className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${isShowAnsers ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isShowAnsers}
                            >
                                Submit Answers
                            </button>
                        </div>
                    </div>
                );
            default:
                return <p className="text-gray-500">Select a step to begin.</p>;
        }
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
        </div>
    );
};

const ProgressBar = ({ enrollment }) => {
    return (
      <div className="">
        <p className="text-gray-100 mb-2">Progress: {enrollment.progress}%</p>
  
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${enrollment.progress}%` }}
          ></div>
        </div>
      </div>
    );
  };


// CourseViewer Component
const CourseViewer = ({ course , currEnrollment}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 730);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedContent, setSelectedContent] = useState(null);
    const [isShowAnsers, setIsShowAnswers] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [totalLessonAndQuiz, setTotalLessonAndQuiz] = useState(0);
    const [enrollment, setEnrollment] = useState(currEnrollment);

    useEffect(() => {
        // Initialize steps
        const initializeSteps = () => {
            const stepsArray = [
                { type: 'course' },
                // Iterate through modules
                ...course.modules.flatMap((module, moduleIdx) => [
                    { type: 'module', moduleIdx },
                    // Iterate through lessons
                    ...module.lessons.map((lesson, lessonIdx) => ({ type: 'lesson', moduleIdx, lessonIdx })),
                    // Iterate through quizzes
                    ...module.quizzes.map((quiz, quizIdx) => ({ type: 'quiz', moduleIdx, quizIdx })),
                ]),
            ];
            setSteps(stepsArray);
            // Calculate the total number of lessons and quizzes
            const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
            const totalQuizzes = course.modules.reduce((sum, module) => sum + module.quizzes.length, 0);
            setTotalLessonAndQuiz(totalLessons + totalQuizzes);
            refreshEnrollment();
        };

        initializeSteps();
    }, [course]);

    useEffect(() => {
        // Set the initial content
        if (steps.length > 0) {
            setSelectedContent(getContentByStep(steps[currentStepIndex]));
        }
    }, [steps, currentStepIndex]);

    const refreshEnrollment = async() => {
        if(enrollment._id){
            try {
                const response = await axios.post(`${URL}/api/auth/get-enrollment`, {
                    enrollmentId: enrollment._id
                });
                if(response.data.success){
                    setEnrollment(response.data.enrollment)
                    // console.log(response.data.enrollment)
                }
            } catch (err) {
                if (err.response) {
                    showErrorToast(err.response.data.message || 'Something went wrong.');
                } else {
                    showErrorToast('Server is not responding.');
                }
            }
        }
    }

    const getContentByStep = (step) => {
        switch (step.type) {
            case 'course':
                return {
                    type: 'course',
                    title: course.title,
                    description: course.description,
                    certificate: course.certificate,
                };
            case 'module':
                const module = course.modules[step.moduleIdx];
                return {
                    type: 'module',
                    title: module.title,
                    description: module.description,
                };
            case 'lesson':
                const lesson = course.modules[step.moduleIdx].lessons[step.lessonIdx];
                return {
                    _id: lesson._id,
                    type: 'lesson',
                    title: lesson.title,
                    description: lesson.description,
                    topics: lesson.topics,
                };
            case 'quiz':
                const quiz = course.modules[step.moduleIdx].quizzes[step.quizIdx];
                return {
                    _id: quiz._id,
                    type: 'quiz',
                    title: quiz.title,
                    questions: quiz.questions,
                };
            default:
                return null;
        }
    };

    const handleNavigation = (direction) => {
        setIsShowAnswers(false);
        const lessonOrQuiz = getContentByStep(steps[currentStepIndex]);
        if (lessonOrQuiz.type === 'lesson' || lessonOrQuiz.type === 'quiz'){
            if(!handleNext(lessonOrQuiz)){
                return;
            }
        }
        if (direction === 'next' && currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else if (direction === 'previous' && currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else {
            setCompleted(true);
        }
    };

    const handleNext = async (lessonOrQuiz) => {
        if(!enrollment.completedLessons.includes(lessonOrQuiz._id) && lessonOrQuiz.type === 'lesson'){
            try {
                const response = await axios.post(`${URL}/api/auth/add-lesson`, {
                    lessonId: lessonOrQuiz._id,
                    enrollmentId: enrollment._id,
                    totalLessonAndQuiz: totalLessonAndQuiz
                });
                
                refreshEnrollment();
                return response.data.success
            } catch (err) {
                if (err.response) {
                    showErrorToast(err.response.data.message || 'Something went wrong.');
                } else {
                    showErrorToast('Server is not responding.');
                }
            }
        } else if(lessonOrQuiz.type === 'quiz') {
            return true;
        }
    }

    const handleSubmitAnswers = async () => {
        const quiz = getContentByStep(steps[currentStepIndex]);
        if (!enrollment.completedQuizzes.includes(quiz._id)){
            try {
                const response = await axios.post(`${URL}/api/auth/add-quiz`, {
                    quizId: quiz._id,
                    enrollmentId: enrollment._id,
                    totalLessonAndQuiz: totalLessonAndQuiz
                });
                setIsShowAnswers(true);
                showSuccessToast(response.data.message);
                refreshEnrollment();
            } catch (err) {
                if (err.response) {
                    showErrorToast(err.response.data.message || 'Something went wrong.');
                } else {
                    showErrorToast('Server is not responding.');
                }
            }
        } else {
            setIsShowAnswers(true);
            showSuccessToast("Quiz Already Completed!")
        }
    }

    const handleSelectStep = (step) => {
        const index = steps.findIndex(
            (s, idx) =>
                s.type === step.type &&
                (s.type === 'module' ? s.moduleIdx === step.moduleIdx :
                    s.type === 'lesson' ? s.moduleIdx === step.moduleIdx && s.lessonIdx === step.lessonIdx :
                        s.type === 'quiz' ? s.moduleIdx === step.moduleIdx && s.quizIdx === step.quizIdx : false)
        );
        if (index !== -1) {
            setCurrentStepIndex(index);
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
        <div className="pt-16 h-screen flex">
            {/* Sidebar */}
            <CourseSidebar
                course={course}
                enrollment={enrollment}
                onSelectStep={handleSelectStep}
                isOpen={isSidebarOpen}
            />

            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-16 ${isSidebarOpen ? 'left-64' : 'left-0'} z-30 bg-transparent text-dark pt-4 pl-1 rounded-r focus:outline-none transition-all duration-300`}
            >
                {isSidebarOpen ? '◐' : '◑'}
            </button>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <CourseContent
                    content={selectedContent}
                    isShowAnsers={isShowAnsers}
                    handleSubmitAnswers={handleSubmitAnswers}
                />
                {/* Navigation Buttons */}
                <div className="flex justify-between p-6">
                    <button
                        onClick={() => handleNavigation('previous')}
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentStepIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handleNavigation('next')}
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={completed}
                    >
                        {currentStepIndex === steps.length - 1 ? "Complete" : "Next"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CourseViewer;
