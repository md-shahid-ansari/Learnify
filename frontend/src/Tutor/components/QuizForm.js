import React, { useState, useEffect } from 'react';

const QuizForm = ({ index, quiz, onQuizChange, handleRemoveQuiz }) => {
    const [quizData, setQuizData] = useState(() => ({
        title: quiz.title || '',
        questions: quiz.questions || []
    }));

    // Sync the local state with the incoming quiz prop
    useEffect(() => {
        setQuizData({
            title: quiz.title || '',
            questions: quiz.questions || []
        });
    }, [quiz]);

    // Update the quiz data and propagate changes to parent
    const updateQuizData = (updatedData) => {
        setQuizData(updatedData);
        onQuizChange(index, updatedData);  // Trigger parent update
    };

    // Handle adding a new question
    const handleAddQuestion = () => {
        const newQuestion = {
            questionText: '',
            questionType: 'multiple-choice',
            options: [],
            correctAnswer: ''
        };
        updateQuizData({
            ...quizData,
            questions: [...quizData.questions, newQuestion]
        });
    };

    // Handle removing a question
    const handleRemoveQuestion = (questionIndex) => {
        const updatedQuestions = quizData.questions.filter((_, i) => i !== questionIndex);
        updateQuizData({ ...quizData, questions: updatedQuestions });
    };

    // Handle question text, type, and correct answer changes
    const handleQuestionChange = (questionIndex, updatedQuestion) => {
        const updatedQuestions = quizData.questions.map((question, i) =>
            i === questionIndex ? updatedQuestion : question
        );
        updateQuizData({ ...quizData, questions: updatedQuestions });
    };

    // Handle adding a new option for a multiple-choice question
    const handleAddOption = (questionIndex) => {
        const updatedQuestions = quizData.questions.map((question, i) =>
            i === questionIndex
                ? { ...question, options: [...question.options, ''] }
                : question
        );
        updateQuizData({ ...quizData, questions: updatedQuestions });
    };

    // Handle removing an option from a multiple-choice question
    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuestions = quizData.questions.map((question, i) =>
            i === questionIndex
                ? { ...question, options: question.options.filter((_, j) => j !== optionIndex) }
                : question
        );
        updateQuizData({ ...quizData, questions: updatedQuestions });
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-l font-semibold mb-2">Quiz {index + 1}</h5>
                <button
                    type="button"
                    onClick={() => handleRemoveQuiz(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    ×
                </button>
            </div>
            <input
                type="text"
                value={quizData.title} // Controlled input
                onChange={(e) => updateQuizData({ ...quizData, title: e.target.value })}
                placeholder="Quiz Title"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
            />

            {/* Render Questions */}
            {quizData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="text-l font-semibold mb-2">Question {questionIndex + 1}</h5>
                        <button
                            type="button"
                            onClick={() => handleRemoveQuestion(questionIndex)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <textarea
                        value={question.questionText} // Controlled input
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                questionText: e.target.value
                            })
                        }
                        placeholder="Question Text"
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                        required
                    />
                    <select
                        value={question.questionType} // Controlled input
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                questionType: e.target.value
                            })
                        }
                        className="mb-2 mr-2 p-2 border border-gray-300 rounded"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true/false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                    </select>

                    {/* Multiple-Choice Options */}
                    {question.questionType === 'multiple-choice' &&
                        question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center justify-between mb-2">
                                <input
                                    type="text"
                                    value={option} // Controlled input
                                    onChange={(e) => {
                                        const updatedOptions = question.options.map((opt, i) =>
                                            i === optionIndex ? e.target.value : opt
                                        );
                                        handleQuestionChange(questionIndex, {
                                            ...question,
                                            options: updatedOptions
                                        });
                                    }}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="mr-2 w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                    {/* Button to add more options for multiple-choice */}
                    {question.questionType === 'multiple-choice' && (
                        <button
                            type="button"
                            onClick={() => handleAddOption(questionIndex)}
                            className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Option
                        </button>
                    )}

                    {/* Correct Answer */}
                    <input
                        type="text"
                        value={question.correctAnswer} // Controlled input
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                correctAnswer: e.target.value
                            })
                        }
                        placeholder="Correct Answer"
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                        required
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Question
            </button>
        </div>
    );
};

export default QuizForm;
