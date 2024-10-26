import React, { useState } from 'react';
import './MentorFeedback.css'; // Add styles here

const MentorFeedback = () => {
    const [feedbackData, setFeedbackData] = useState([
        {
            projectId: 1,
            projectTitle: "AI-Powered Healthcare System",
            studentName: "John Doe",
            feedback: "",
        },
        {
            projectId: 2,
            projectTitle: "E-Commerce Website",
            studentName: "Jane Smith",
            feedback: "",
        },
    ]);

    const handleFeedbackChange = (projectId, value) => {
        setFeedbackData((prevFeedback) =>
            prevFeedback.map((project) =>
                project.projectId === projectId
                    ? { ...project, feedback: value }
                    : project
            )
        );
    };

    const handleSubmit = (projectId) => {
        const project = feedbackData.find((p) => p.projectId === projectId);
        console.log(`Feedback for Project ID: ${projectId}`, project.feedback);
        alert(`Feedback for ${project.projectTitle} submitted!`);
    };

    return (
        <div className="mentor-feedback-container">
            <h1>Mentor Feedback</h1>
            {feedbackData.map((project) => (
                <div key={project.projectId} className="project-feedback">
                    <h2>{project.projectTitle}</h2>
                    <p><strong>Student:</strong> {project.studentName}</p>
                    <textarea
                        placeholder="Enter your feedback"
                        value={project.feedback}
                        onChange={(e) =>
                            handleFeedbackChange(project.projectId, e.target.value)
                        }
                    ></textarea>
                    <button onClick={() => handleSubmit(project.projectId)}>
                        Submit Feedback
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MentorFeedback;
