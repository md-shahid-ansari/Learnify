import React, { useState } from 'react';

const TopicForm = ({ index, topic, onTopicChange }) => {
    const [topicData, setTopicData] = useState(topic || {
        title: '',
        content: '',
        learningOutcomes: [],
        images: [],
        videos: []
    });

    // Helper to update state and propagate changes
    const updateTopicData = (updatedData) => {
        setTopicData(updatedData);
        onTopicChange(index, updatedData);  // Trigger parent update
    };

    // Handle adding a new outcome
    const handleAddOutcome = () => {
        const updatedData = {
            ...topicData,
            learningOutcomes: [...(topicData.learningOutcomes || []), '']
        };
        updateTopicData(updatedData);
    };

    // Handle removing an outcome
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

    // Handle adding/removing images
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

    // Handle adding/removing videos
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
        <div>
            <h5>Topic {index + 1}</h5>

            {/* Topic Title */}
            <input
                type="text"
                value={topicData.title || ''}
                onChange={(e) => updateTopicData({ ...topicData, title: e.target.value })}
                placeholder="Topic Title"
            />

            {/* Topic Content */}
            <textarea
                value={topicData.content || ''}
                onChange={(e) => updateTopicData({ ...topicData, content: e.target.value })}
                placeholder="Topic Content"
            />

            {/* Learning Outcomes */}
            <div>
                <h6>Learning Outcomes</h6>
                {(topicData.learningOutcomes || []).map((outcome, outcomeIndex) => (
                    <div key={outcomeIndex}>
                        <input
                            type="text"
                            value={outcome}
                            onChange={(e) => handleOutcomeChange(outcomeIndex, e.target.value)}
                            placeholder={`Outcome ${outcomeIndex + 1}`}
                        />
                        <button type="button" onClick={() => handleRemoveOutcome(outcomeIndex)}>
                            Remove Outcome
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddOutcome}>Add Outcome</button>
            </div>

            {/* Add Images */}
            <div>
                <h6>Images</h6>
                {(topicData.images || []).map((image, imageIndex) => (
                    <div key={imageIndex}>
                        <input
                            type="text"
                            value={image.title}
                            onChange={(e) => handleImageChange(imageIndex, 'title', e.target.value)}
                            placeholder={`Image Title ${imageIndex + 1}`}
                        />
                        <input
                            type="file"
                            onChange={(e) => handleImageChange(imageIndex, 'file', e.target.files[0])}
                        />
                        {image.file && <p>{image.file.name}</p>}
                        <button type="button" onClick={() => handleRemoveImage(imageIndex)}>
                            Remove Image
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddImage}>Add Image</button>
            </div>

            {/* Add Videos */}
            <div>
                <h6>Videos</h6>
                {(topicData.videos || []).map((video, videoIndex) => (
                    <div key={videoIndex}>
                        <input
                            type="text"
                            value={video.title}
                            onChange={(e) => handleVideoChange(videoIndex, 'title', e.target.value)}
                            placeholder={`Video Title ${videoIndex + 1}`}
                        />
                        <input
                            type="text"
                            value={video.url}
                            onChange={(e) => handleVideoChange(videoIndex, 'url', e.target.value)}
                            placeholder="Video URL"
                        />
                        <button type="button" onClick={() => handleRemoveVideo(videoIndex)}>
                            Remove Video
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddVideo}>Add Video</button>
            </div>
        </div>
    );
};

export default TopicForm;
