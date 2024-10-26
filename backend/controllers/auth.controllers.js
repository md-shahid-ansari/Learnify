import { Student } from '../models/student.model.js';
import { Mentor } from '../models/mentor.model.js';
import { Company } from '../models/company.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail , sendPasswordResetEmail, sendResetSuccessEmail } from '../nodemailer/emails.js';


//student

// Student Registration
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

// Verify Student Email
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

// Student Login
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

// Student Forgot Password
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

// Student Reset Password
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

// Student Logout
export const studentLogout = async (req, res) => {
    res.clearCookie("studentToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Authenticate Student
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




// mentor 

export const mentorRegister = async (req, res) => {
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
        // Mandatory fields validation
        if (!email || !password || !name) {
            throw new Error("Email, password, and name are required");
        }

        let mentor = await Mentor.findOne({ email });

        if (mentor && mentor.isVerified === true) {
            return res.status(400).json({ success: false, message: "Mentor Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        if (!mentor) {
            mentor = new Mentor({
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
            mentor.password = hashedPassword;
            mentor.name = name;
            mentor.dateOfBirth = dateOfBirth;
            mentor.gender = gender;
            mentor.contactNumber = contactNumber;
            mentor.address = address;
            mentor.expertiseAreas = expertiseAreas;
            mentor.yearsOfExperience = yearsOfExperience;
            mentor.certifications = certifications;
            mentor.linkedInProfile = linkedInProfile;
            mentor.verificationToken = verificationToken;
            mentor.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }

        await mentor.save();

        // JWT
        generateTokenAndSetCookie(res, mentor._id, "mentorToken");

        await sendVerificationEmail(mentor.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...mentor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const mentorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const mentor = await Mentor.findOne({ email });
        if (!mentor) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, mentor.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, mentor._id, "mentorToken");

        mentor.lastLogin = new Date();
        await mentor.save();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...mentor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const verifyMentorEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const mentor = await Mentor.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!mentor) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        mentor.isVerified = true;
        mentor.verificationToken = undefined;
        mentor.verificationExpireAt = undefined;

        await mentor.save();

        await sendWelcomeEmail(mentor.email, mentor.name);

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: {
                ...mentor._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const mentorForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const mentor = await Mentor.findOne({ email });
        if (!mentor) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

        mentor.resetPasswordToken = resetToken;
        mentor.resetPasswordExpireAt = resetTokenExpiresAt;

        await mentor.save();

        // Send email
        await sendPasswordResetEmail(mentor.email, `${process.env.CLIENT_URL}/mentor-reset/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password link sent successfully",
        });

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const mentorReset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const mentor = await Mentor.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });

        if (!mentor) {
            return res.status(400).json({ success: false, message: "Invalid token or expired" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        mentor.password = hashedPassword;
        mentor.resetPasswordToken = undefined;
        mentor.resetPasswordExpireAt = undefined;
        await mentor.save();

        // Send email
        await sendResetSuccessEmail(mentor.email);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const mentorLogout = async (req, res) => {
    res.clearCookie("mentorToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const authMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.userId).select("-password");
        if (!mentor) {
            return res.status(400).json({ success: false, message: "Mentor not found" });
        }
        res.status(200).json({ success: true, mentor });
    } catch (error) {
        console.log("Error in check auth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};




// company 

export const companyRegister = async (req, res) => {
    const {
        email,
        password,
        name,
        registrationNumber,
        contactPerson,
        contactNumber,
        address,
        industry,
        companyWebsite,
        linkedinProfile,
        companySize
    } = req.body;

    try {
        // Mandatory fields validation
        if (!email || !password || !name) {
            throw new Error("Email, password, and name are required");
        }

        let company = await Company.findOne({ email });

        if (company && company.isVerified === true) {
            return res.status(400).json({ success: false, message: "Company already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        if (!company) {
            company = new Company({
                email,
                password: hashedPassword,
                companyName:name,
                registrationNumber,
                contactPerson,
                contactNumber,
                address,
                industry,
                companyWebsite,
                linkedinProfile,
                companySize,
                verificationToken,
                verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            });
        } else {
            company.password = hashedPassword;
            company.companyName = name;
            company.registrationNumber = registrationNumber;
            company.contactPerson = contactPerson;
            company.contactNumber = contactNumber;
            company.address = address;
            company.industry = industry;
            company.companyWebsite = companyWebsite;
            company.linkedinProfile = linkedinProfile;
            company.companySize = companySize;
            company.verificationToken = verificationToken;
            company.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }

        await company.save();

        // JWT
        generateTokenAndSetCookie(res, company._id, "companyToken");

        await sendVerificationEmail(company.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: {
                ...company._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const companyLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, company.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, company._id, "companyToken");

        company.lastLogin = new Date();
        await company.save();

        res.status(200).json({
            success: true,
            message: "Company logged in successfully",
            company: {
                ...company._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const verifyCompanyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const company = await Company.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!company) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        company.isVerified = true;
        company.verificationToken = undefined;
        company.verificationExpireAt = undefined;

        await company.save();

        await sendWelcomeEmail(company.email, company.name);

        res.status(200).json({
            success: true,
            message: "Company verified successfully",
            company: {
                ...company._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const companyForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

        company.resetPasswordToken = resetToken;
        company.resetPasswordExpireAt = resetTokenExpiresAt;

        await company.save();

        // Send email
        await sendPasswordResetEmail(company.email, `${process.env.CLIENT_URL}/company-reset/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password link sent successfully",
        });

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const companyReset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const company = await Company.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });

        if (!company) {
            return res.status(400).json({ success: false, message: "Invalid token or expired" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        company.password = hashedPassword;
        company.resetPasswordToken = undefined;
        company.resetPasswordExpireAt = undefined;
        await company.save();

        // Send email
        await sendResetSuccessEmail(company.email);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const companyLogout = async (req, res) => {
    res.clearCookie("companyToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const authCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.userId).select("-password");
        if (!company) {
            return res.status(400).json({ success: false, message: "Company not found" });
        }
        res.status(200).json({ success: true, company });
    } catch (error) {
        console.log("Error in check auth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
