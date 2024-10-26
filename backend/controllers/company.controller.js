import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Challenge } from "../models/challenge.model.js";

export const createProject = async (req, res) => {
    const { projectTitle, projectDescription, assignedStudents, assignedMentor, githubRepoURL, taskList} = req.body;
    
    // Check if required fields are provided
    if (!projectTitle || !projectDescription || !assignedMentor || !taskList || taskList.length === 0) {
        return res.status(400).json({ message: "Please fill in all required fields and ensure tasks are added." });
    }
    
    try {
        // Create tasks and store their IDs
        const taskIds = await Promise.all(taskList.map(async (taskData) => {
            const task = new Task({
                taskTitle: taskData.title,
                taskDescription: taskData.description,
                status: taskData.status || 'not started'
            });
            const savedTask = await task.save();
            return savedTask._id;  // Return the task's ObjectId
        }));

        // Create the project with the task IDs
        const project = new Project({
            projectTitle,
            projectDescription,
            assignedStudents: assignedStudents || [],  // Default to empty array if not provided
            assignedMentor,
            githubRepoURL,
            taskList: taskIds,
            status: 'in progress',  // Default status
        });

        // Save the project to the database
        const savedProject = await project.save();

        // Respond with the saved project
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: savedProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Failed to create project' });
    }
};

export const fetchProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('taskList') // Populate the taskList field with the actual task documents
            .exec();
        if(!projects.length){
            return res.status(404).json({ message: "No projects found" });
        }

        res.status(200).json({data: projects}); // Send the projects as a JSON response
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects.' }); // Send an error response if fetching fails
    }
};

// Fetch all challenges
export const fetchChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({});
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ message: 'Failed to fetch challenges.' });
    }
};

// Create a new challenge
export const createChallenge = async (req, res) => {
    const { title, description, companyId, skillsRequired, duration, submissionDeadline, rewardRecognition, status } = req.body;

    const newChallenge = new Challenge({
        title:title,
        description:description,
        companyId:companyId,
        skillsRequired:skillsRequired,
        duration:duration,
        submissionDeadline:submissionDeadline,
        rewardRecognition:rewardRecognition,
        status:status,
    });

    try {
        await newChallenge.save();
        res.status(201).json(newChallenge);
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ message: 'Failed to create challenge.' });
    }
};

// Update an existing challenge
export const updateChallenge = async (req, res) => {
    const { title, description, companyId, skillsRequired, duration, submissionDeadline, rewardRecognition, status } = req.body;

    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            {
                title:title,
                description:description,
                companyId:companyId,
                skillsRequired:skillsRequired,
                duration:duration,
                submissionDeadline:submissionDeadline,
                rewardRecognition:rewardRecognition,
                status:status,
            },
            { new: true } // Returns the updated document
        );

        if (!updatedChallenge) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }

        res.status(200).json(updatedChallenge);
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ message: 'Failed to update challenge.' });
    }
};

// Delete a challenge
export const deleteChallenge = async (req, res) => {
    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);

        if (!deletedChallenge) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }

        res.status(200).json({ message: 'Challenge deleted successfully.' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({ message: 'Failed to delete challenge.' });
    }
};
