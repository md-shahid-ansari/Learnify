import React, { useState, useEffect } from 'react';
import './ManageChallenges.css'; // Create a new CSS file for styles
import { IsCompanySessionLive } from '../utils/IsCompanySessionLive';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const ManageChallenges = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [challenges, setChallenges] = useState([]); // To store challenges
    const [editChallengeId, setEditChallengeId] = useState(null); // For editing a challenge
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [skillsRequired, setSkillsRequired] = useState([]);
    const [duration, setDuration] = useState('');
    const [submissionDeadline, setSubmissionDeadline] = useState('');
    const [rewardRecognition, setRewardRecognition] = useState('');
    const [status, setStatus] = useState('open');

    useEffect(() => {
        let isMounted = true;
        const authenticate = async () => {
            const { isAuthenticated } = await IsCompanySessionLive();

            if (!isMounted) return;

            if (!isAuthenticated) {
                setError('You are not authenticated. Please log in again.');
                navigate('/company-login');
                setLoading(false);
                return;
            }

            try {
                // Load existing challenges
                const response = await axios.post(`${URL}/api/auth/fetch-challenges`);
                setChallenges(response.data); // Adjust based on your actual data structure
            } catch (error) {
                console.error('Error fetching challenges:', error);
                setError('Failed to load challenges.');
            }
            setLoading(false);
        };
        authenticate();

        return () => { isMounted = false; }; // Cleanup
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newChallenge = {
            title,
            description,
            companyId,
            skillsRequired,
            duration,
            submissionDeadline,
            rewardRecognition,
            status,
        };

        try {
            if (editChallengeId) {
                // Update existing challenge
                await axios.put(`${URL}/api/auth/update-challenge/${editChallengeId}`, newChallenge);
            } else {
                // Create new challenge
                await axios.post(`${URL}/api/auth/create-challenge`, newChallenge);
            }
            // Reset the form after submission
            resetForm();
            fetchChallenges(); // Refresh the challenge list
        } catch (error) {
            console.error('Error creating/updating challenge:', error);
            setError('Failed to create/update challenge. Please try again.');
        }
    };

    const handleEdit = (challenge) => {
        setEditChallengeId(challenge._id);
        setTitle(challenge.title);
        setDescription(challenge.description);
        setCompanyId(challenge.companyId);
        setSkillsRequired(challenge.skillsRequired);
        setDuration(challenge.duration);
        setSubmissionDeadline(new Date(challenge.submissionDeadline).toISOString().substring(0, 10)); // Format date for input
        setRewardRecognition(challenge.rewardRecognition);
        setStatus(challenge.status);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL}/api/auth/delete-challenge/${id}`);
            setChallenges(challenges.filter(challenge => challenge._id !== id));
        } catch (error) {
            console.error('Error deleting challenge:', error);
            setError('Failed to delete challenge.');
        }
    };

    const resetForm = () => {
        setEditChallengeId(null);
        setTitle('');
        setDescription('');
        setCompanyId('');
        setSkillsRequired([]);
        setDuration('');
        setSubmissionDeadline('');
        setRewardRecognition('');
        setStatus('open');
    };

    const fetchChallenges = async () => {
        try {
            const response = await axios.post(`${URL}/api/auth/fetch-challenges`);
            setChallenges(response.data);
        } catch (error) {
            console.error('Error fetching challenges:', error);
            setError('Failed to load challenges.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manage-challenges">
            <h2>Manage Challenges</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Challenge Title</label>
                    <input
                        type="text"
                        placeholder="Challenge Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Company ID</label>
                    <input
                        type="text"
                        placeholder="Company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Skills Required (comma-separated)</label>
                    <input
                        type="text"
                        placeholder="e.g., JavaScript, React"
                        value={skillsRequired.join(', ')}
                        onChange={(e) => setSkillsRequired(e.target.value.split(',').map(skill => skill.trim()))}
                    />
                </div>
                <div className="form-group">
                    <label>Duration</label>
                    <input
                        type="text"
                        placeholder="Expected Duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Submission Deadline</label>
                    <input
                        type="date"
                        value={submissionDeadline}
                        onChange={(e) => setSubmissionDeadline(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Reward/Recognition</label>
                    <input
                        type="text"
                        placeholder="Reward or Recognition"
                        value={rewardRecognition}
                        onChange={(e) => setRewardRecognition(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <button type="submit">{editChallengeId ? 'Update Challenge' : 'Create Challenge'}</button>
                <button type="button" onClick={resetForm}>Reset</button>
            </form>

            {challenges.length > 0 ? (
                <table className="challenge-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challenges.map((challenge) => (
                            <tr key={challenge.challengeId}>
                                <td>{challenge.title}</td>
                                <td>{challenge.description}</td>
                                <td>{challenge.status}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(challenge)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(challenge._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No challenges available.</p>
            )}
        </div>
    );
};

export default ManageChallenges;
