import React, { useState, useEffect } from 'react';
import './ChallengeDetails.css'; // Add styling here
import axios from 'axios';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';
import { useNavigate } from 'react-router-dom';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const ChallengeDetails = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [challenges, setChallenges] = useState([]);
    const [issueExplanation, setIssueExplanation] = useState(''); // State for issue explanation
    const [submissionLink, setSubmissionLink] = useState(''); // State for submission link

    // Fetch challenges from API
    useEffect(() => {
        const fetchChallenges = async () => {
            const { isAuthenticated, studentData } = await IsStudentSessionLive();

            if (!isAuthenticated) {
                setError('You are not authenticated. Please log in again.');
                navigate('/student-login');
                setLoading(false);
                return;
            }
            setStudentData(studentData);

            try {
                const response = await axios.post(`${URL}/api/auth/fetch-challenges`);
                setChallenges(response.data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
                setError('Failed to fetch challenges. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [navigate]);

    // Handle submission
    const handleSubmission = async (challengeId) => {
        if (!submissionLink) {
            alert('Please provide a submission link.');
            return;
        }

        try {
            await axios.post(`${URL}/api/auth/submit-challenge`, {
                studentId: studentData.studentId,
                challengeId,
                gitHubRepoURL: submissionLink,
            });
            alert(`Submission successful for challenge (ID: ${challengeId})`);
            setSubmissionLink(''); // Reset the input after submission
        } catch (error) {
            console.error('Error submitting challenge:', error);
            alert('Failed to submit challenge. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading challenges...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="challenge-list">
            {challenges.map((challenge) => (
                <div key={challenge.challengeId} className="challenge-detail">
                    <nav className="challenge-header">
                        <h1>{challenge.title}</h1>
                        <p>{challenge.description}</p>
                    </nav>

                    <section className="mentor-details">
                        <h2>Mentor ID</h2>
                        <p><strong>Mentor ID:</strong> {challenge.mentorId}</p>
                        <textarea
                            placeholder="Explain your issue or guidance needed"
                            value={issueExplanation}
                            onChange={(e) => setIssueExplanation(e.target.value)} // Handle explanation input
                            rows={4}
                            style={{ width: '100%', marginBottom: '10px' }}
                            disabled // Disable mentor request field
                        />
                        <button className="help-button" disabled>
                            Request Help
                        </button>
                        <p className="note">Note: This feature will be available in the future if mentor assigned.</p> {/* Note added here */}
                    </section>

                    <section className="submission-details">
                        <h2>Submit Your Work</h2>
                        <input
                            type="text"
                            placeholder="Enter your GitHub repo link"
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)} // Handle submission link input
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <button className="submit-button" onClick={() => handleSubmission(challenge.challengeId)}>
                            Submit
                        </button>
                    </section>
                </div>
            ))}
        </div>
    );
};

export default ChallengeDetails;
