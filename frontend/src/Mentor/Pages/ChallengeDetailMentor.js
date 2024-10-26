import React, { useState, useEffect } from 'react';
import './ChallengeDetailMentor.css';

const ChallengesDetailMentor = () => {
    const [challenge, setChallenge] = useState(null);
    const [mentorResponse, setMentorResponse] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching challenge data from an API
        const fetchChallengeData = async () => {
            try {
                // Simulate an API call with a delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock challenge data
                const mockChallengeData = {
                    title: 'AI-Powered Crop Prediction',
                    description: 'Develop an AI model to predict crop yields based on weather data.',
                    deadline: '2024-11-30',
                    applications: [
                        {
                            studentName: 'Alice Johnson',
                            projectTitle: 'AI in Agriculture',
                            query: 'I want to apply machine learning techniques to improve crop prediction.',
                        },
                        {
                            studentName: 'Bob Lee',
                            projectTitle: 'Weather Data Analysis',
                            query: 'I have experience with data analytics and want to contribute to this challenge.',
                        },
                    ],
                };

                setChallenge(mockChallengeData);
            } catch (err) {
                setError('Failed to fetch challenge data');
            } finally {
                setLoading(false);
            }
        };

        fetchChallengeData();
    }, []); // Runs once when the component mounts

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleResponseSubmit = () => {
        console.log(`Response to ${selectedApplication.studentName}: ${mentorResponse}`);
        alert(`Response sent to ${selectedApplication.studentName}`);
        setMentorResponse('');
        setSelectedApplication(null);
        // API call for sending the mentor response
    };

    return (
        <div className="challenges-detail-mentor">
            <h1>{challenge.title}</h1>
            <p>{challenge.description}</p>
            <p><strong>Deadline:</strong> {challenge.deadline}</p>

            <section className="applications">
                <h2>Applications</h2>
                {challenge.applications.length > 0 ? (
                    <ul>
                        {challenge.applications.map((application, index) => (
                            <li key={index} className="application-card">
                                <h3>{application.studentName}</h3>
                                <p>Project: {application.projectTitle}</p>
                                <p>Query: {application.query}</p>
                                <button onClick={() => setSelectedApplication(application)}>
                                    Respond
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No applications for this challenge yet.</p>
                )}

                {selectedApplication && (
                    <div className="mentor-response">
                        <h3>Responding to {selectedApplication.studentName}'s Application</h3>
                        <textarea
                            placeholder="Enter your response here"
                            value={mentorResponse}
                            onChange={(e) => setMentorResponse(e.target.value)}
                        />
                        <button onClick={handleResponseSubmit}>Submit Response</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ChallengesDetailMentor;
