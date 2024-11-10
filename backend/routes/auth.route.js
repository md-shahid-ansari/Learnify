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
    getAllCourses,

    updateTutor
} from "../controllers/tutor.controller.js";
import { 
    updateStudent,
    enroll,
    getEnrollments,
    getEnrollment,
    getCourse,
    addLesson,
    addQuiz,
    getCertificates
 } from "../controllers/student.controller.js";
import { 
    updateAdmin,
    getAllAdmin,
    getAllCertificates,
    getAllCoursesWithoutAnyModule,
    getAllTutors,
    getAllStudents,
    getAllEnrollments,
    deleteBatch
 } from "../controllers/admin.controller.js";


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

router.post("/tutor-update", updateTutor);
router.post("/student-update", updateStudent);
router.post("/admin-update", updateAdmin);

router.post("/enroll", enroll);
router.post("/course", getCourse);
router.post("/enrollments", getEnrollments);
router.post("/add-lesson", addLesson);
router.post("/add-quiz", addQuiz);
router.post("/get-enrollment", getEnrollment);
router.post("/certificates", getCertificates);

router.post("/get-all-enrollments", getAllEnrollments);
router.post("/get-all-admins", getAllAdmin);
router.post("/get-all-certificates", getAllCertificates);
router.post("/get-all-courses", getAllCoursesWithoutAnyModule);
router.post("/get-all-tutors", getAllTutors);
router.post("/get-all-students", getAllStudents);

router.post("/delete-batch", deleteBatch);

export default router;