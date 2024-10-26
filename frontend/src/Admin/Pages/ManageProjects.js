import React, { useState, useEffect } from 'react';
import './ManageProjects.css';
import { IsCompanySessionLive } from '../utils/IsCompanySessionLive';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const ManageProjects = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [projects, setProjects] = useState([]); // To store projects
    const [editProjectId, setEditProjectId] = useState(null); // For editing a project
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [assignedMentor, setAssignedMentor] = useState('');
    const [githubRepoURL, setGithubRepoURL] = useState('');
    const [taskList, setTaskList] = useState([{ title: '', description: '', status: 'not started' }]); // Initial task with description

    useEffect(() => {
        let isMounted = true;
        const authenticate = async () => {
            const { isAuthenticated, companyData } = await IsCompanySessionLive();

            if (!isMounted) return;

            if (!isAuthenticated) {
                setError('You are not authenticated. Please log in again.');
                navigate('/company-login');
                setLoading(false);
                return;
            }
            setCompanyData(companyData);
            
            try {
                // Load existing projects (You might want to fetch this from your API)
                const response = await axios.post(`${URL}/api/auth/fetch-projects`);
                if(response.status === 200){
                    setProjects(response.data.data);
                }
                
            } catch (error) {
                setError('Failed to load projects.', error);
            }
            setLoading(false);
        }
        authenticate();
    }, [navigate]);

    const handleAddTask = () => {
        setTaskList([...taskList, { title: '', description: '', status: 'not started' }]);
    };

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...taskList];
        newTasks[index][field] = value;
        setTaskList(newTasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // Step 2: Create the project with the task IDs
            const newProject = {
                projectTitle,
                projectDescription,
                assignedStudents,
                assignedMentor,
                githubRepoURL,
                taskList, // Use task IDs instead of the full task list
            };

            await axios.post(`${URL}/api/auth/create-project`, newProject);


            // Step 4: Reset the form
            setEditProjectId(null);
            setProjectTitle('');
            setProjectDescription('');
            setAssignedStudents([]);
            setAssignedMentor('');
            setGithubRepoURL('');
            setTaskList([{ title: '', description: '', status: 'not started' }]); // Reset tasks

        } catch (error) {
            console.error('Error creating project or tasks:', error);
            setError('Failed to create project. Please try again.');
        }
    };

    const handleEdit = (project) => {
        setEditProjectId(project.projectId);
        setProjectTitle(project.projectTitle);
        setProjectDescription(project.projectDescription);
        setAssignedStudents(project.assignedStudents);
        setAssignedMentor(project.assignedMentor);
        setGithubRepoURL(project.githubRepoURL);
        setTaskList(project.taskList.map(task => ({
            title: task.taskTitle,
            description: task.taskDescription || '', // Add description for each task
            status: task.status,
        })));
    };

    const handleDelete = (id) => {
        setProjects(projects.filter(project => project.id !== id));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manage-projects">
            <h2>Manage Projects</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Project Title</label>
                    <input
                        type="text"
                        placeholder="Project Title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Project Description</label>
                    <textarea
                        placeholder="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Assigned Mentor ID</label>
                    <input
                        type="text"
                        placeholder="Assigned Mentor ID"
                        value={assignedMentor}
                        onChange={(e) => setAssignedMentor(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>GitHub Repo URL</label>
                    <input
                        type="text"
                        placeholder="GitHub Repo URL"
                        value={githubRepoURL}
                        onChange={(e) => setGithubRepoURL(e.target.value)}
                    />
                </div>
                <h3>Tasks</h3>
                {taskList.map((task, index) => (
                    <div key={index} className="task-group">
                        <div className="form-group">
                            <label>Task Title</label>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={task.title}
                                onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Task Description</label>
                            <textarea
                                placeholder="Task Description"
                                value={task.description}
                                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={task.status}
                                onChange={(e) => handleTaskChange(index, 'status', e.target.value)}
                            >
                                <option value="not started">Not Started</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddTask}>Add Task</button>
                <button type="submit">{editProjectId ? 'Update Project' : 'Create Project'}</button>
            </form>

            {projects.length > 0 ? (
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
                        {projects.map((project) => (
                            <tr key={project.projectId}>
                                <td>{project.projectTitle}</td>
                                <td>{project.projectDescription}</td>
                                <td>{project.taskList.length ? project.taskList.map(task => task.status).join(', ') : 'No tasks'}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(project)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(project.projectId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No projects available.</p>
            )}
        </div>
    );
};

export default ManageProjects;
