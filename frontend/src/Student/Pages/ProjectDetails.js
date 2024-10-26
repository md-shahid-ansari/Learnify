import React, { useState, useEffect } from 'react';
import './ProjectDetails.css'; // Add styling here
import axios from 'axios';
import { IsStudentSessionLive } from '../utils/IsStudentSessionLive';
import { useNavigate } from 'react-router-dom';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const ProjectDetails = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState([])
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [githubLinks, setGithubLinks] = useState({});
    const [issueExplanation, setIssueExplanation] = useState(''); // State for issue explanation

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            const { isAuthenticated , studentData} = await IsStudentSessionLive();

            if (!isAuthenticated) {
                setError('You are not authenticated. Please log in again.');
                navigate('/student-login');
                setLoading(false);
                return;
            }
            setStudentData(studentData);

            try {
                const response = await axios.post(`${URL}/api/auth/fetch-projects`);
                setProjects(response.data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Failed to fetch projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    const handleGithubSubmit = async (task_id, taskId, projectId) => {
        const githubLink = githubLinks[taskId] || '';
        if (!githubLink) {
            alert('Please enter a GitHub repository URL.');
            return;
        }
        try {
            await axios.post(`${URL}/api/auth/submit-task-repo`, {
                gitHubRepoURL: githubLink,
                projectId,
                taskId,
                studentId: studentData.studentId,
                task_Id : task_id
            });
            alert('GitHub repository link submitted successfully!');
        } catch (error) {
            console.error('Error submitting GitHub link:', error);
            alert('Failed to submit GitHub repository link. Please try again.');
        }
    };

    const handleGithubLinkChange = (taskId, link) => {
        setGithubLinks((prevLinks) => ({
            ...prevLinks,
            [taskId]: link,
        }));
    };

    // Handle mentor help request
    const handleHelpRequest = async (mentorId, projectId) => {
        if (!issueExplanation) {
            alert('Please provide an explanation for your request.');
            return;
        }

        try {
            await axios.post(`${URL}/api/auth/request-mentor-help`, {
                studentId: studentData.studentId /* your logic to get student ID */,
                mentorId,
                projectId,
                requestDetails: issueExplanation, // Include issue explanation
            });
            alert(`Help request sent to mentor (ID: ${mentorId})`);
            setIssueExplanation(''); // Reset the input after submission
        } catch (error) {
            console.error('Error sending help request:', error);
            alert('Failed to send help request. Please try again.');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.post(`${URL}/api/auth/update-task-status`, {
                taskId,
                status: newStatus,
            });
            alert(`Task status updated to: ${newStatus}`);
            setProjects((prevProjects) => 
                prevProjects.map((project) => {
                    if (project.taskList.some((task) => task.taskId === taskId)) {
                        return {
                            ...project,
                            taskList: project.taskList.map((task) =>
                                task.taskId === taskId ? { ...task, status: newStatus } : task
                            ),
                        };
                    }
                    return project;
                })
            );
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="project-list">
            {projects.map((project) => (
                <div key={project.projectId} className="project-detail">
                    <nav className="project-header">
                        <h1>{project.projectTitle}</h1>
                        <p>{project.projectDescription}</p>
                    </nav>

                    <section className="tasks">
                        <h2>Tasks</h2>
                        <ul>
                            {project.taskList.map((task) => (
                                <li key={task.taskId} className="task-item">
                                    <h3>{task.taskTitle}</h3>
                                    <p>Due Date: {task.dueDate}</p>
                                    <p>Status: {task.status}</p>
                                    <input
                                        type="url"
                                        placeholder="Enter your GitHub repo link"
                                        value={githubLinks[task.taskId] || ''}
                                        onChange={(e) => handleGithubLinkChange(task.taskId, e.target.value)}
                                    />
                                    <button onClick={() => handleGithubSubmit(task._id, task.taskId, project.projectId)}>
                                        Submit GitHub Link
                                    </button>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    >
                                        <option value="not started">Not Started</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mentor-details">
                        <h2>Mentor ID</h2>
                        <p><strong>Mentor ID:</strong> {project.assignedMentor}</p>
                        <textarea
                            placeholder="Explain your issue or guidance needed"
                            value={issueExplanation}
                            onChange={(e) => setIssueExplanation(e.target.value)} // Handle explanation input
                            rows={4}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <button className="help-button" onClick={() => handleHelpRequest(project.assignedMentor, project.projectId)}>
                            Request Help
                        </button>
                    </section>
                </div>
            ))}
        </div>
    );
};

export default ProjectDetails;
