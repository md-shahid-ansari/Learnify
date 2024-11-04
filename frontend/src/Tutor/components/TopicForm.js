import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

const TopicForm = ({ index, topic, onTopicChange, handleRemoveTopic }) => {
    const [topicData, setTopicData] = useState({
        _id: '',
        title: '',
        content: '',
        learningOutcomes: [],
        images: [],
        links: [],
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
        const newImage = {id: nanoid(), title: '', file: null, previewUrl: null };
        updateTopicData({
            ...topicData,
            images: [...(topicData.images || []), newImage]
        });
    };

    const handleRemoveImage = (imageId) => {
        const updatedImages = (topicData.images || []).filter((image) => image._id !== imageId);
        updateTopicData({ ...topicData, images: updatedImages });
    };

    const handleImageChange = (imageId, field, value) => {
        setTopicData((prevTopicData) => {
            const updatedImages = (prevTopicData.images || []).map((image) => 
                image._id === imageId
                    ? {
                          ...image,
                          [field]: value,
                          previewUrl: field === 'file' ? URL.createObjectURL(value) : image.previewUrl,
                          file: field === 'file' ? value : image.file
                      }
                    : image
            );
            const updatedData = { ...prevTopicData, images: updatedImages };
            updateTopicData(updatedData);
            return updatedData;
        });
    };

    const handleImageClick = (imageId) => {
        document.getElementById(`file-input-${imageId}`).click();
    };

    const handleAddlink = () => {
        const newLink = { id: nanoid(), title: '', url: '' };
        updateTopicData({
            ...topicData,
            links: [...(topicData.links || []), newLink]
        });
    };

    const handleRemovelink = (linkId) => {
        const updatedLinks = (topicData.links || []).filter((link) => link._id !== linkId);
        updateTopicData({ ...topicData, links: updatedLinks });
    };

    const handleLinkChange = (linkId, field, value) => {
        const updatedLinks = (topicData.links || []).map((link) =>
            link._id === linkId ? { ...link, [field]: value } : link
        );
        updateTopicData({ ...topicData, links: updatedLinks });
    };

    return (
        <div className="mb-4">
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
                {(topicData.images || []).map((image) => (
                    <div key={image._id} className="mb-4">
                        <div className="flex items-center mb-2">
                            <input
                                type="text"
                                value={image.title}
                                onChange={(e) => handleImageChange(image._id, 'title', e.target.value)}
                                placeholder={`Image Title`}
                                className="w-full mr-2 p-2 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(image._id)}
                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                aria-label={`Remove Image`}
                            >
                                ×
                            </button>
                            <input
                                id={`file-input-${image._id}`}
                                type="file"
                                onChange={(e) => handleImageChange(image._id, 'file', e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                        <div onClick={() => handleImageClick(image._id)} className="cursor-pointer w-full">
                            {image.previewUrl ? (
                                <img
                                    src={image.previewUrl}
                                    alt={image.title || `Preview`}
                                    className="w-full object-cover border rounded"
                                />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-200 border rounded">
                                    <span className="text-gray-500">Select Image</span>
                                </div>
                            )}
                        </div>
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

            {/* Links Section */}
            <div>
                <h6 className="text-md font-semibold">Links</h6>
                {(topicData.links || []).map((link) => (
                    <div key={link._id} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleLinkChange(link._id, 'title', e.target.value)}
                            placeholder="Link Title"
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleLinkChange(link._id, 'url', e.target.value)}
                            placeholder="Link URL"
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemovelink(link._id)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            aria-label={`Remove link`}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddlink}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add link
                </button>
            </div>
        </div>
    );
};

export default TopicForm;
