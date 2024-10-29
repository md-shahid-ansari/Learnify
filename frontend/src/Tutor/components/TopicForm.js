import React, { useState, useEffect } from 'react';

const TopicForm = ({ index, topic, onTopicChange, handleRemoveTopic }) => {
    const [topicData, setTopicData] = useState({
        title: '',
        content: '',
        learningOutcomes: [],
        images: [],
        videos: [],
        ...topic // Spread existing topic data
    });

    // Sync props with local state
    useEffect(() => {
        if (topic) {
            setTopicData(topic);
        }
    }, [topic]);

    // Helper to update state and propagate changes
    const updateTopicData = (updatedData) => {
        setTopicData(updatedData);
        onTopicChange(index, updatedData);  // Trigger parent update
    };

    const handleAddOutcome = () => {
        const updatedData = {
            ...topicData,
            learningOutcomes: [...(topicData.learningOutcomes || []), '']
        };
        updateTopicData(updatedData);
    };

    const handleRemoveOutcome = (outcomeIndex) => {
        const updatedOutcomes = (topicData.learningOutcomes || []).filter((_, i) => i !== outcomeIndex);
        updateTopicData({ ...topicData, learningOutcomes: updatedOutcomes });
    };

    const handleOutcomeChange = (outcomeIndex, value) => {
        const updatedOutcomes = (topicData.learningOutcomes || []).map((outcome, i) =>
            i === outcomeIndex ? value : outcome
        );
        updateTopicData({ ...topicData, learningOutcomes: updatedOutcomes });
    };

    const handleAddImage = () => {
        const newImage = { title: '', file: null };
        updateTopicData({
            ...topicData,
            images: [...(topicData.images || []), newImage]
        });
    };

    const handleRemoveImage = (imageIndex) => {
        const updatedImages = (topicData.images || []).filter((_, i) => i !== imageIndex);
        updateTopicData({ ...topicData, images: updatedImages });
    };

    const handleImageChange = (imageIndex, field, value) => {
        const updatedImages = (topicData.images || []).map((img, i) =>
            i === imageIndex ? { ...img, [field]: value } : img
        );
        updateTopicData({ ...topicData, images: updatedImages });
    };

    const handleAddVideo = () => {
        const newVideo = { title: '', url: '' };
        updateTopicData({
            ...topicData,
            videos: [...(topicData.videos || []), newVideo]
        });
    };

    const handleRemoveVideo = (videoIndex) => {
        const updatedVideos = (topicData.videos || []).filter((_, i) => i !== videoIndex);
        updateTopicData({ ...topicData, videos: updatedVideos });
    };

    const handleVideoChange = (videoIndex, field, value) => {
        const updatedVideos = (topicData.videos || []).map((video, i) =>
            i === videoIndex ? { ...video, [field]: value } : video
        );
        updateTopicData({ ...topicData, videos: updatedVideos });
    };

    return (
        <div className="border p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg font-semibold">Topic {index + 1}</h5>
                <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    aria-label="Remove Topic"
                >
                    ×
                </button>
            </div>

            {/* Topic Title */}
            <input
                type="text"
                value={topicData.title || ''}
                onChange={(e) => updateTopicData({ ...topicData, title: e.target.value })}
                placeholder="Topic Title"
                className="mt-2 mb-4 w-full p-2 border border-gray-300 rounded"
                required
            />

            {/* Topic Content */}
            <textarea
                value={topicData.content || ''}
                onChange={(e) => updateTopicData({ ...topicData, content: e.target.value })}
                placeholder="Topic Content"
                className="mt-2 mb-4 w-full p-2 border border-gray-300 rounded"
                required
            />

            {/* Learning Outcomes */}
            <div className="mb-4">
                <h6 className="text-md font-semibold">Learning Outcomes</h6>
                {(topicData.learningOutcomes || []).map((outcome, outcomeIndex) => (
                    <div key={outcomeIndex} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={outcome}
                            onChange={(e) => handleOutcomeChange(outcomeIndex, e.target.value)}
                            placeholder={`Outcome ${outcomeIndex + 1}`}
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveOutcome(outcomeIndex)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            aria-label={`Remove Outcome ${outcomeIndex + 1}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Outcome
                </button>
            </div>

            {/* Images Section */}
            <div className="mb-4">
                <h6 className="text-md font-semibold">Images</h6>
                {(topicData.images || []).map((image, imageIndex) => (
                    <div key={imageIndex} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={image.title}
                            onChange={(e) => handleImageChange(imageIndex, 'title', e.target.value)}
                            placeholder={`Image Title ${imageIndex + 1}`}
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="file"
                            onChange={(e) => handleImageChange(imageIndex, 'file', e.target.files[0])}
                            className="mr-2"
                        />
                        {image.file && <p className="text-gray-500">{image.file.name}</p>}
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(imageIndex)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            aria-label={`Remove Image ${imageIndex + 1}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddImage}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Image
                </button>
            </div>

            {/* Videos Section */}
            <div>
                <h6 className="text-md font-semibold">Videos</h6>
                {(topicData.videos || []).map((video, videoIndex) => (
                    <div key={videoIndex} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={video.title}
                            onChange={(e) => handleVideoChange(videoIndex, 'title', e.target.value)}
                            placeholder={`Video Title ${videoIndex + 1}`}
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={video.url}
                            onChange={(e) => handleVideoChange(videoIndex, 'url', e.target.value)}
                            placeholder="Video URL"
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveVideo(videoIndex)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            aria-label={`Remove Video ${videoIndex + 1}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddVideo}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Video
                </button>
            </div>
        </div>
    );
};

export default TopicForm;
