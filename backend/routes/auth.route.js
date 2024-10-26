import express from "express";
import {
    studentRegister,
    verifyStudentEmail,
    studentLogin,
    studentForgot,
    studentReset,
    studentLogout,
    authStudent,

    mentorRegister,
    verifyMentorEmail,
    mentorLogin,
    mentorForgot,
    mentorReset,
    mentorLogout,
    authMentor,

    companyRegister,
    verifyCompanyEmail,
    companyLogin,
    companyForgot,
    companyReset,
    companyLogout,
    authCompany
} from "../controllers/auth.controllers.js";
import { verifyCompany } from "../midlayer/verifyCompany.js";
import { verifyStudent } from "../midlayer/verifyStudent.js";
import { verifyMentor } from "../midlayer/verifyMentor.js";

import { 
    createProject,
    fetchProjects,
    
    createChallenge,
    fetchChallenges,
    deleteChallenge,
    updateChallenge,
 } from "../controllers/company.controller.js";

 import {
    submitTaskRepo,
    requestMentorHelp,
    updateTaskStatus,
    submitChallenge
 } from "../controllers/student.controller.js";


const router = express.Router();

// Student Routes
router.post("/student-register", studentRegister);
router.post("/student-verify", verifyStudentEmail);
router.post("/student-login", studentLogin);
router.post("/student-forgot", studentForgot);
router.post("/student-reset/:token", studentReset);
router.post("/student-logout", studentLogout);
router.get("/student-auth", verifyStudent, authStudent);

// Mentor Routes
router.post("/mentor-register", mentorRegister);
router.post("/mentor-verify", verifyMentorEmail);
router.post("/mentor-login", mentorLogin);
router.post("/mentor-forgot", mentorForgot);
router.post("/mentor-reset/:token", mentorReset);
router.post("/mentor-logout", mentorLogout);
router.get("/mentor-auth", verifyMentor, authMentor);

// Company Routes
router.post("/company-register", companyRegister);
router.post("/company-verify", verifyCompanyEmail);
router.post("/company-login", companyLogin);
router.post("/company-forgot", companyForgot);
router.post("/company-reset/:token", companyReset);
router.post("/company-logout", companyLogout);
router.get("/company-auth", verifyCompany, authCompany);



router.post("/create-project", createProject);
router.post("/fetch-projects", fetchProjects);


router.post('/fetch-challenges', fetchChallenges);
router.post('/create-challenge', createChallenge);
router.put('/update-challenge/:id', updateChallenge);
router.delete('/delete-challenge/:id', deleteChallenge);

router.post('/submit-task-repo', submitTaskRepo);
router.post('/request-mentor-help', requestMentorHelp);
router.post('/update-task-status', updateTaskStatus);
router.post('/submit-challenge', submitChallenge);

export default router;