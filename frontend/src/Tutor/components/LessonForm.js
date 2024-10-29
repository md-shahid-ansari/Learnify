import React, { useState, useEffect } from 'react';
import TopicForm from './TopicForm'; // Import the TopicForm component

const LessonForm = ({ index, lesson, onLessonChange, handleRemoveLesson }) => {
    const [lessonData, setLessonData] = useState(lesson || { title: '', description: '', topics: [] });

    // Sync the local state with the incoming lesson prop
    useEffect(() => {
        setLessonData(lesson);
    }, [lesson]);

    // Handle changes to the lesson title
    const handleTitleChange = (e) => {
        const updatedLessonData = { ...lessonData, title: e.target.value };
        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    // Handle changes to the lesson description
    const handleDescriptionChange = (e) => {
        const updatedLessonData = { ...lessonData, description: e.target.value };
        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    // Handle adding a new topic
    const handleAddTopic = () => {
        const newTopic = { title: '', content: '', learningOutcomes: [] };
        const updatedTopics = [...(lessonData.topics || []), newTopic];
        const updatedLessonData = { ...lessonData, topics: updatedTopics };

        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    // Handle removing a topic
    const handleRemoveTopic = (topicIndex) => {
        const updatedTopics = lessonData.topics.filter((_, i) => i !== topicIndex);
        const updatedLessonData = { ...lessonData, topics: updatedTopics };

        setLessonData(updatedLessonData);
        onLessonChange(index, updatedLessonData); // Update parent
    };

    return (
        <div className="mb-6 p-4 border border-gray-300 rounded-md">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Lesson {index + 1}</h4>
                <button
                    type="button"
                    onClick={() => handleRemoveLesson(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    ×
                </button>
            </div>
            <input
                type="text"
                value={lessonData.title}
                onChange={handleTitleChange}
                placeholder="Lesson Title"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <textarea
                value={lessonData.description}
                onChange={handleDescriptionChange}
                placeholder="Lesson Description"
                className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />

            {/* Render Topic Components */}
            <h2 className="text-lg font-bold mb-4">Topics</h2>
            {lessonData.topics?.map((topic, topicIndex) => (
                <div key={topicIndex} className="mb-4">
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
                        handleRemoveTopic={handleRemoveTopic}
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddTopic}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Add Topic
            </button>
        </div>
    );
};

export default LessonForm;
