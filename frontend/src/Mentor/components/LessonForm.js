import React, { useState, useEffect } from 'react';
import TopicForm from './TopicForm';  // Topic Component
import QuizForm from './QuizForm';  // Quiz Component

const LessonForm = ({ index, lesson, onLessonChange }) => {
    const [lessonData, setLessonData] = useState(lesson);

    // Sync the local state with the incoming lesson prop
    useEffect(() => {
        setLessonData(lesson);
    }, [lesson]);

    const handleAddTopic = () => {
        const newTopic = { title: '', content: '', learningOutcomes: [] };
        const updatedTopics = [...(lessonData.topics || []), newTopic];
        const updatedLessonData = { ...lessonData, topics: updatedTopics };
        
        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    const handleRemoveTopic = (topicIndex) => {
        const updatedTopics = lessonData.topics.filter((_, i) => i !== topicIndex);
        const updatedLessonData = { ...lessonData, topics: updatedTopics };

        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    const handleAddQuiz = () => {
        const newQuiz = { title: '', questions: [] };
        const updatedQuizzes = [...(lessonData.quizzes || []), newQuiz];
        const updatedLessonData = { ...lessonData, quizzes: updatedQuizzes };
        
        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    const handleRemoveQuiz = (quizIndex) => {
        const updatedQuizzes = lessonData.quizzes.filter((_, i) => i !== quizIndex);
        const updatedLessonData = { ...lessonData, quizzes: updatedQuizzes };

        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    return (
        <div>
            <h4>Lesson {index + 1}</h4>
            <input
                type="text"
                value={lessonData.title}
                onChange={(e) => {
                    const updatedLessonData = { ...lessonData, title: e.target.value };
                    setLessonData(updatedLessonData);
                    onLessonChange(index, updatedLessonData); // Update parent
                }}
                placeholder="Lesson Title"
            />
            <textarea
                value={lessonData.description}
                onChange={(e) => {
                    const updatedLessonData = { ...lessonData, description: e.target.value };
                    setLessonData(updatedLessonData);
                    onLessonChange(index, updatedLessonData); // Update parent
                }}
                placeholder="Lesson Description"
            />

            {/* Render Topic Components */}
            {lessonData.topics.map((topic, topicIndex) => (
                <div key={topicIndex}>
                    <TopicForm
                        index={topicIndex}
                        topic={topic}
                        onTopicChange={(i, updatedTopic) => {
                            const updatedTopics = lessonData.topics.map((t, idx) =>
                                idx === i ? updatedTopic : t
                            );
                            const updatedLessonData = { ...lessonData, topics: updatedTopics };
                            
                            setLessonData(updatedLessonData);
                            onLessonChange(index, updatedLessonData); // Update parent
                        }}
                    />
                    <button type="button" onClick={() => handleRemoveTopic(topicIndex)}>
                        Remove Topic
                    </button>
                </div>
            ))}

            {/* Render Quiz Components */}
            {lessonData.quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex}>
                    <QuizForm
                        index={quizIndex}
                        quiz={quiz}
                        onQuizChange={(i, updatedQuiz) => {
                            const updatedQuizzes = lessonData.quizzes.map((q, idx) =>
                                idx === i ? updatedQuiz : q
                            );
                            const updatedLessonData = { ...lessonData, quizzes: updatedQuizzes };
                            
                            setLessonData(updatedLessonData);
                            onLessonChange(index, updatedLessonData); // Update parent
                        }}
                    />
                    <button type="button" onClick={() => handleRemoveQuiz(quizIndex)}>
                        Remove Quiz
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAddTopic}>Add Topic</button>
            <button type="button" onClick={handleAddQuiz}>Add Quiz</button>
        </div>
    );
};

export default LessonForm;
