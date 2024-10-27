import { Student } from '../models/student.model.js';
import { Tutor } from '../models/tutor.model.js';
import { Admin } from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail , sendPasswordResetEmail, sendResetSuccessEmail } from '../nodemailer/emails.js';


//student

export const studentRegister = async (req, res) => {
    const { 
        email, 
        password, 
        name, 
        dateOfBirth, 
        gender, 
        contactNumber, 
        address, 
        emergencyContact,
        courses,
        skills,
        education
    } = req.body;

    try {
        // Mandatory fields validation
        if (!email || !password || !name) {
            throw new Error("Email, password, and name are required");
        }

        let student = await Student.findOne({ email });

        if (student && student.isVerified === true) {
            return res.status(400).json({ success: false, message: "Student Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        if (!student) {
            student = new Student({
                email,
                password: hashedPassword,
                name,
                dateOfBirth,
                gender,
                contactNumber,
                address,
                emergencyContact,
                courses,
                skills,
                education,
                verificationToken,
                verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            });
        } else {
            student.password = hashedPassword;
            student.name = name;
            student.dateOfBirth = dateOfBirth;
            student.gender = gender;
            student.contactNumber = contactNumber;
            student.address = address;
            student.emergencyContact = emergencyContact;
            student.courses = courses;
            student.skills = skills;
            student.education = education;
            student.verificationToken = verificationToken;
            student.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }

        await student.save();

        // JWT
        generateTokenAndSetCookie(res, student._id, "studentToken");

        await sendVerificationEmail(student.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...student._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const verifyStudentEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const student = await Student.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        student.isVerified = true;
        student.verificationToken = undefined;
        student.verificationExpireAt = undefined;

        await student.save();

        await sendWelcomeEmail(student.email, student.name);

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: {
                ...student._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isValidPassword = await bcrypt.compare(password, student.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, student._id, "studentToken");

        student.lastLogin = new Date();
        await student.save();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...student._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const studentForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        student.resetPasswordToken = resetToken;
        student.resetPasswordExpireAt = resetTokenExpiresAt;

        await student.save();

        // Send email
        await sendPasswordResetEmail(student.email, `${process.env.CLIENT_URL}/student-reset/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password link sent successfully",
        });

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const studentReset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const student = await Student.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });
        if (!student) {
            return res.status(400).json({ success: false, message: "Invalid token or expired" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        student.password = hashedPassword;
        student.resetPasswordToken = undefined;
        student.resetPasswordExpireAt = undefined;
        await student.save();

        // Send email
        await sendResetSuccessEmail(student.email);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const studentLogout = async (req, res) => {
    res.clearCookie("studentToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const authStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.userId).select("-password");
        if (!student) {
            return res.status(400).json({ success: false, message: "Student not found" });
        }
        res.status(200).json({ success: true, student });
    } catch (error) {
        console.log("Error in check auth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};





//tutor

export const tutorRegister = async (req, res) => {
    const {
        email,
        password,
        name,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        expertiseAreas,
        yearsOfExperience,
        certifications,
        linkedInProfile
    } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("Email, password, and name are required");
        }

        let tutor = await Tutor.findOne({ email });

        if (tutor && tutor.isVerified === true) {
            return res.status(400).json({ success: false, message: "Tutor Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        if (!tutor) {
            tutor = new Tutor({
                email,
                password: hashedPassword,
                name,
                dateOfBirth,
                gender,
                contactNumber,
                address,
                expertiseAreas,
                yearsOfExperience,
                certifications,
                linkedInProfile,
                verificationToken,
                verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            });
        } else {
            tutor.password = hashedPassword;
            tutor.name = name;
            tutor.dateOfBirth = dateOfBirth;
            tutor.gender = gender;
            tutor.contactNumber = contactNumber;
            tutor.address = address;
            tutor.expertiseAreas = expertiseAreas;
            tutor.yearsOfExperience = yearsOfExperience;
            tutor.certifications = certifications;
            tutor.linkedInProfile = linkedInProfile;
            tutor.verificationToken = verificationToken;
            tutor.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }

        await tutor.save();

        generateTokenAndSetCookie(res, tutor._id, "tutorToken");

        await sendVerificationEmail(tutor.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...tutor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const tutorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tutor = await Tutor.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, tutor.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, tutor._id, "tutorToken");

        tutor.lastLogin = new Date();
        await tutor.save();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...tutor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyTutorEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const tutor = await Tutor.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!tutor) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        tutor.isVerified = true;
        tutor.verificationToken = undefined;
        tutor.verificationExpireAt = undefined;

        await tutor.save();

        await sendWelcomeEmail(tutor.email, tutor.name);

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: {
                ...tutor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const tutorForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const tutor = await Tutor.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

        tutor.resetPasswordToken = resetToken;
        tutor.resetPasswordExpireAt = resetTokenExpiresAt;

        await tutor.save();

        await sendPasswordResetEmail(tutor.email, `${process.env.CLIENT_URL}/tutor-reset/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password link sent successfully",
        });

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const tutorReset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const tutor = await Tutor.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });

        if (!tutor) {
            return res.status(400).json({ success: false, message: "Invalid token or expired" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        tutor.password = hashedPassword;
        tutor.resetPasswordToken = undefined;
        tutor.resetPasswordExpireAt = undefined;
        await tutor.save();

        await sendResetSuccessEmail(tutor.email);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const tutorLogout = async (req, res) => {
    res.clearCookie("tutorToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const authTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.userId).select("-password");
        if (!tutor) {
            return res.status(400).json({ success: false, message: "Tutor not found" });
        }
        res.status(200).json({ success: true, tutor });
    } catch (error) {
        console.log("Error in check auth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};




// admin

export const adminRegister = async (req, res) => {
    const { email, password, adminName, contactNumber, role } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !adminName) {
            throw new Error("Email, password, and adminName are required");
        }

        let admin = await Admin.findOne({ email });
        if (admin && admin.isVerified === true) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        if (!admin) {
            admin = new Admin({
                email,
                password: hashedPassword,
                adminName,
                contactNumber,
                role,
                verificationToken,
                verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            });
        } else {
            admin.password = hashedPassword;
            admin.adminName = adminName;
            admin.contactNumber = contactNumber;
            admin.role = role;
            admin.verificationToken = verificationToken;
            admin.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        }

        await admin.save();

        // JWT and Verification Email
        generateTokenAndSetCookie(res, admin._id, "adminToken");
        await sendVerificationEmail(admin.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                ...admin._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, admin._id, "adminToken");

        admin.lastLogin = new Date();
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            admin: {
                ...admin._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const verifyAdminEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const admin = await Admin.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        admin.isVerified = true;
        admin.verificationToken = undefined;
        admin.verificationExpireAt = undefined;

        await admin.save();
        await sendWelcomeEmail(admin.email, admin.adminName);

        res.status(200).json({
            success: true,
            message: "Admin verified successfully",
            admin: {
                ...admin._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const adminForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpireAt = resetTokenExpiresAt;

        await admin.save();

        await sendPasswordResetEmail(admin.email, `${process.env.CLIENT_URL}/admin-reset/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password link sent successfully",
        });

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const adminLogout = async (req, res) => {
    res.clearCookie("adminToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const authAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId).select("-password");
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.log("Error in check auth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
