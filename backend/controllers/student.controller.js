import { Task } from "../models/task.model.js";
import {MentorRequest} from "../models/mentorrequest.model.js"
import { Submission } from "../models/submission.model.js";

export const updateTaskStatus = async (req, res) => {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
        return res.status(400).json({ message: 'Task ID and status are required.' });
    }

    const validStatuses = ['not started', 'in progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json({ message: 'Task status updated successfully!', updatedTask });
    } catch (error) {
        console.error('Error updating task status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


export const requestMentorHelp = async (req, res) => {
    let { studentId, mentorId, projectId, requestDetails, challengeId } = req.body;
    console.log(studentId, mentorId, projectId, requestDetails, challengeId)
    if (!studentId || !mentorId || !requestDetails) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!projectId){
        projectId = "";
    }
    if (!challengeId){
        challengeId = "";
    }
    if (projectId === "" && challengeId === ""){
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const mentorRequest = new MentorRequest({
            studentId:studentId,
            mentorId:mentorId,
            projectId:projectId,
            challengeId:challengeId,
            requestDetails:requestDetails,
            requestStatus: 'pending', // Set initial status to pending
        });

        await mentorRequest.save();

        return res.status(201).json({ message: 'Mentor request sent successfully!', mentorRequest });
    } catch (error) {
        console.error('Error requesting mentor help:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


export const submitTaskRepo = async (req, res) => {
    const { gitHubRepoURL, projectId, taskId, studentId, task_Id } = req.body;

    if (!gitHubRepoURL || !projectId || !taskId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const submission = new Submission({
            gitHubRepoURL: gitHubRepoURL,
            projectId: projectId,
            taskId: taskId,
            studentId: studentId, // Assuming user ID is available in req.user
            submissionDate: new Date(),
        });

        await submission.save();

        // Optionally, you can update the task status
        await Task.findByIdAndUpdate(task_Id, { status: 'submitted' });

        return res.status(201).json({ message: 'Submission successful!', submission });
    } catch (error) {
        console.error('Error submitting GitHub link:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export const submitChallenge = async (req, res) => {
    const { gitHubRepoURL, studentId, challengeId } = req.body;

    if (!gitHubRepoURL || !studentId || !challengeId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const submission = new Submission({
            gitHubRepoURL: gitHubRepoURL,
            challengeId: challengeId,
            studentId: studentId, // Assuming user ID is available in req.user
            submissionDate: new Date(),
        });

        await submission.save();

        return res.status(201).json({ message: 'Submission successful!', submission });
    } catch (error) {
        console.error('Error submitting GitHub link:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
