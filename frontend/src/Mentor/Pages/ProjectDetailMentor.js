import React, { useState, useEffect } from 'react';
import './ProjectDetailMentor.css';

const ProjectDetailMentor = () => {
    const [project, setProject] = useState(null);
    const [githubRepo, setGithubRepo] = useState('');
    const [mentorResponse, setMentorResponse] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching project data from an API
        const fetchProjectData = async () => {
            try {
                // Simulate an API call with a delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock project data
                const mockProjectData = {
                    title: 'AI Farming Solution',
                    description: 'A project focused on leveraging AI for better farming practices.',
                    mentor: {
                        name: 'Dr. Jane Smith',
                        profilePicture: 'https://via.placeholder.com/150',
                    },
                    teamMembers: [
                        {
                            name: 'Alice Johnson',
                            profilePicture: 'https://via.placeholder.com/150',
                        },
                        {
                            name: 'Bob Lee',
                            profilePicture: 'https://via.placeholder.com/150',
                        },
                    ],
                    tasks: [
                        { title: 'Research AI Models', status: 'In Progress', dueDate: '2024-10-20' },
                        { title: 'Data Collection', status: 'Not Started', dueDate: '2024-11-05' },
                    ],
                    supportRequests: [
                        { studentName: 'Alice Johnson', query: 'Can you provide more resources for AI models?' },
                        { studentName: 'Bob Lee', query: 'I need help with data collection techniques.' },
                    ],
                };

                setProject(mockProjectData);
            } catch (err) {
                setError('Failed to fetch project data');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, []); // Runs once when the component mounts

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleGithubSubmit = () => {
        console.log("GitHub Repository Submitted: ", githubRepo);
        // API call for submitting GitHub repo
    };

    const handleResponseSubmit = () => {
        console.log(`Response to ${selectedRequest.studentName}: ${mentorResponse}`);
        alert(`Response sent to ${selectedRequest.studentName}`);
        setMentorResponse('');
        setSelectedRequest(null);
        // API call for sending the mentor response
    };

    return (
        <div className="project-detail-mentor">
            <h1>{project.title}</h1>
            <p>{project.description}</p>

            <section className="mentor-info">
                <h2>Assigned Mentor</h2>
                <div className="mentor-profile">
                    <img src={project.mentor.profilePicture} alt={project.mentor.name} />
                    <p>{project.mentor.name}</p>
                </div>
            </section>

            <section className="github-repo">
                <h2>GitHub Repository</h2>
                <input
                    type="url"
                    placeholder="Enter the GitHub repo link"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                />
                <button onClick={handleGithubSubmit}>Submit GitHub Link</button>
            </section>

            <section className="team-members">
                <h2>Team Members</h2>
                <ul>
                    {project.teamMembers.map((member, index) => (
                        <li key={index}>
                            <img src={member.profilePicture} alt={member.name} />
                            <p>{member.name}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="tasks">
                <h2>Assigned Tasks</h2>
                <ul>
                    {project.tasks.map((task, index) => (
                        <li key={index}>
                            <h3>{task.title}</h3>
                            <p>Status: {task.status}</p>
                            <select defaultValue={task.status}>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <p>Due Date: {task.dueDate}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="support-requests">
                <h2>Student Support Requests</h2>
                {project.supportRequests.length > 0 ? (
                    <ul>
                        {project.supportRequests.map((request, index) => (
                            <li key={index} className="support-request">
                                <h3>From: {request.studentName}</h3>
                                <p>Query: {request.query}</p>
                                <button onClick={() => setSelectedRequest(request)}>
                                    Respond
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No support requests at the moment.</p>
                )}

                {selectedRequest && (
                    <div className="mentor-response">
                        <h3>Responding to {selectedRequest.studentName}'s Request</h3>
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

export default ProjectDetailMentor;
