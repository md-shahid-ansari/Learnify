import React, { useState, useEffect } from 'react';

const TopicForm = ({ index, topic, onTopicChange, handleRemoveTopic }) => {
    const [topicData, setTopicData] = useState({
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

    
    // Function to handle image changes
    const handleImageChange = (index, field, value) => {
        setTopicData((prevTopicData) => {
            const updatedImages = [...prevTopicData.images];
            updatedImages[index] = {
                ...updatedImages[index],
                [field]: value,
                previewUrl: field === 'file' ? URL.createObjectURL(value) : updatedImages[index].previewUrl,
                file: field === 'file' ? value : updatedImages[index].file // Store the actual file object
            };
            const updatedData = { ...prevTopicData, images: updatedImages };
            updateTopicData(updatedData);
            return updatedData;
        });
    };
    

    // Function to trigger file input click
    const handleImageClick = (index) => {
        document.getElementById(`file-input-${index}`).click();
    };


    const handleAddlink = () => {
        const newlink = { title: '', url: '' };
        updateTopicData({
            ...topicData,
            links: [...(topicData.links || []), newlink]
        });
    };

    const handleRemovelink = (linkIndex) => {
        const updatedlinks = (topicData.links || []).filter((_, i) => i !== linkIndex);
        updateTopicData({ ...topicData, links: updatedlinks });
    };

    const handlelinkChange = (linkIndex, field, value) => {
        const updatedlinks = (topicData.links || []).map((link, i) =>
            i === linkIndex ? { ...link, [field]: value } : link
        );
        updateTopicData({ ...topicData, links: updatedlinks });
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
                {(topicData.images || []).map((image, imageIndex) => (
                    <div key={imageIndex} className="mb-4">
                        <div className="flex items-center mb-2">
                            <input
                                type="text"
                                value={image.title}
                                onChange={(e) => handleImageChange(imageIndex, 'title', e.target.value)}
                                placeholder={`Image Title ${imageIndex + 1}`}
                                className="w-full mr-2 p-2 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(imageIndex)}
                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                aria-label={`Remove Image ${imageIndex + 1}`}
                            >
                                ×
                            </button>
                            {/* Hidden File Input */}
                            <input
                                id={`file-input-${imageIndex}`}
                                type="file"
                                onChange={(e) => handleImageChange(imageIndex, 'file', e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                        {/* Clickable Image Preview */}
                        <div onClick={() => handleImageClick(imageIndex)} className="cursor-pointer w-full">
                            {image.previewUrl ? (
                                <img
                                    src={image.previewUrl}
                                    alt={image.title || `Preview ${imageIndex + 1}`}
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


            {/* links Section */}
            <div>
                <h6 className="text-md font-semibold">Links</h6>
                {(topicData.links || []).map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handlelinkChange(linkIndex, 'title', e.target.value)}
                            placeholder={`Link Title ${linkIndex + 1}`}
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handlelinkChange(linkIndex, 'url', e.target.value)}
                            placeholder="link URL"
                            className="mr-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemovelink(linkIndex)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            aria-label={`Remove link ${linkIndex + 1}`}
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
