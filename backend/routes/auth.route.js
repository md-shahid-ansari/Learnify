import express from "express";
import {
    studentRegister,
    verifyStudentEmail,
    studentLogin,
    studentForgot,
    studentReset,
    studentLogout,
    authStudent,

    tutorRegister,
    verifyTutorEmail,
    tutorLogin,
    tutorForgot,
    tutorReset,
    tutorLogout,
    authTutor,

    adminRegister,
    verifyAdminEmail,
    adminLogin,
    adminForgot,
    adminReset,
    adminLogout,
    authAdmin
} from "../controllers/auth.controllers.js";

import { verifyAdmin } from "../midlayer/verifyAdmin.js";
import { verifyStudent } from "../midlayer/verifyStudent.js";
import { verifyTutor } from "../midlayer/verifyTutor.js";

import { 
    createCourse, 
    fetchCourses, 
    uploadImage,
    getFile,
    deleteCourse,
    updateCourse,
    getAllCourses
} from "../controllers/tutor.controller.js";


const router = express.Router();

// Student Routes
router.post("/student-register", studentRegister);
router.post("/student-verify", verifyStudentEmail);
router.post("/student-login", studentLogin);
router.post("/student-forgot", studentForgot);
router.post("/student-reset/:token", studentReset);
router.post("/student-logout", studentLogout);
router.get("/student-auth", verifyStudent, authStudent);

// Tutor Routes
router.post("/tutor-register", tutorRegister);
router.post("/tutor-verify", verifyTutorEmail);
router.post("/tutor-login", tutorLogin);
router.post("/tutor-forgot", tutorForgot);
router.post("/tutor-reset/:token", tutorReset);
router.post("/tutor-logout", tutorLogout);
router.get("/tutor-auth", verifyTutor, authTutor);

// Admin Routes
router.post("/admin-register", adminRegister);
router.post("/admin-verify", verifyAdminEmail);
router.post("/admin-login", adminLogin);
router.post("/admin-forgot", adminForgot);
router.post("/admin-reset/:token", adminReset);
router.post("/admin-logout", adminLogout);
router.get("/admin-auth", verifyAdmin, authAdmin);

router.post("/upload-image", uploadImage);
router.post("/create-course", createCourse);
router.post("/fetch-courses", fetchCourses);
router.get("/files/:fileId", getFile);
router.post("/delete-course", deleteCourse);
router.post("/update-course", updateCourse);


router.post("/courses", getAllCourses);



export default router;