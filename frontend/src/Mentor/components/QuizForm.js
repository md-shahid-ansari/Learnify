import React, { useState } from 'react';

const QuizForm = ({ index, quiz, onQuizChange }) => {
    const [quizData, setQuizData] = useState(quiz || {
        title: '',
        questions: []
    });

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
        <div>
            <h5>Quiz {index + 1}</h5>
            <input
                type="text"
                value={quizData.title}
                onChange={(e) => updateQuizData({ ...quizData, title: e.target.value })}
                placeholder="Quiz Title"
            />

            {/* Render Questions */}
            {quizData.questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                    <h6>Question {questionIndex + 1}</h6>
                    <textarea
                        value={question.questionText}
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                questionText: e.target.value
                            })
                        }
                        placeholder="Question Text"
                    />
                    <select
                        value={question.questionType}
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                questionType: e.target.value
                            })
                        }
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true/false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                    </select>

                    {/* Multiple-Choice Options */}
                    {question.questionType === 'multiple-choice' &&
                        question.options.map((option, optionIndex) => (
                            <div key={optionIndex}>
                                <input
                                    type="text"
                                    value={option}
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
                                />
                                <button type="button" onClick={() => handleRemoveOption(questionIndex, optionIndex)}>
                                    Remove Option
                                </button>
                            </div>
                        ))}

                    {/* Button to add more options for multiple-choice */}
                    {question.questionType === 'multiple-choice' && (
                        <button type="button" onClick={() => handleAddOption(questionIndex)}>
                            Add Option
                        </button>
                    )}

                    {/* Correct Answer */}
                    <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) =>
                            handleQuestionChange(questionIndex, {
                                ...question,
                                correctAnswer: e.target.value
                            })
                        }
                        placeholder="Correct Answer"
                    />

                    {/* Remove Question Button */}
                    <button type="button" onClick={() => handleRemoveQuestion(questionIndex)}>
                        Remove Question
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAddQuestion}>
                Add Question
            </button>
        </div>
    );
};

export default QuizForm;
