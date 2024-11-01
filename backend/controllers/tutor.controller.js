import {Course} from '../models/course.model.js'; // Import the Course model

export const createCourse = async (req, res) => {
    // const { formData } = req.body;
    // console.log(formData);
    // Access fields and files through multer
    const courseData = req.body;

    console.log(courseData); // Logs all text fields
    console.log(files);      // Logs uploaded files
    // Validate input
    if (!formData) {
        return res.status(400).json({ error: "All course fields are required." });
    } else {
        return res.status(201).json({ success : true, message: "Course created successfully!",});
    }

    try {
        // Create new course entry in the database
        const newCourse = new Course({
            name: course.name,
            description: course.description,
            duration: course.duration,
            // Add other course fields if needed
        });

        await newCourse.save();

        // Send success response
        res.status(201).json({
            success : true,
            message: "Course created successfully!",
            course: newCourse
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "An error occurred while creating the course." });
    }
};
