import {Course} from '../models/course.model.js';
import {Module} from '../models/module.model.js';
import {Lesson} from '../models/lesson.model.js';
import {Quiz} from '../models/quiz.model.js';
import {Topic} from '../models/topic.model.js';

import multer from 'multer';
import { bucket } from '../db/connectDb.js'; // Import the GridFS instance
import { Readable } from 'stream';

// Setup multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });


export const uploadImage = (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      const { file } = req;
  
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const readableStream = Readable.from(file.buffer);
  
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });
  
      readableStream.pipe(uploadStream);
  
      uploadStream.on('finish', () => {
        res.status(201).json({
          file: {
            filename: uploadStream.filename,
            id: uploadStream.id,
            contentType: uploadStream.contentType,
          },
        });
      });
  
      uploadStream.on('error', (error) => {
        res.status(500).json({ error: error.message });
      });
    });
  };


export const createCourse = async (req, res) => {
    const { course , tutorId } = req.body;
 
    // Validate input
    if (!course || !course.title || !course.description) {
        return res.status(400).json({ error: "Course title and description are required." });
    }

    try {
        // Create the course document
        const newCourse = new Course({
            title: course.title,
            description: course.description,
            certificate: course.certificate,
            tutor: tutorId,
        });

        // Save each module, lesson, topic, image, and quiz, and associate with course
        for (const moduleData of course.modules) {
            const newModule = new Module({
                title: moduleData.title,
                description: moduleData.description,
            });

            // Process each lesson within the module
            for (const lessonData of moduleData.lessons) {
                const newLesson = new Lesson({
                    title: lessonData.title,
                    description: lessonData.description,
                });

                // Process each topic within the lesson
                for (const topicData of lessonData.topics) {
                    const newTopic = new Topic({
                        title: topicData.title,
                        content: topicData.content,
                        learningOutcomes: topicData.learningOutcomes,
                    });

                    // Add images to topic
                    for (const image of topicData.images) {
                        newTopic.images.push({
                            title: image.title,
                            fileId: image.fileId,     // FileId from GridFS
                            filename: image.filename, // Filename for reference
                        });
                    }

                    // Add links to topic
                    newTopic.links = topicData.links;

                    // Save topic and associate with lesson
                    await newTopic.save();
                    newLesson.topics.push(newTopic._id);
                }

                // Save lesson and associate with module
                await newLesson.save();
                newModule.lessons.push(newLesson._id);
            }

            // Process quizzes within the module
            for (const quizData of moduleData.quizzes) {
                const newQuiz = new Quiz({
                    title: quizData.title,
                });

                // Process questions within the quiz
                for (const questionData of quizData.questions) {
                    newQuiz.questions.push({
                        questionText: questionData.questionText,
                        questionType: questionData.questionType,
                        options: questionData.options,
                        correctAnswer: questionData.correctAnswer,
                    });
                }

                // Save quiz and associate with module
                await newQuiz.save();
                newModule.quizzes.push(newQuiz._id);
            }

            // Save module and associate with course
            await newModule.save();
            newCourse.modules.push(newModule._id);
        }

        // Save the course document with all associated modules
        await newCourse.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Course created successfully!",
            course: newCourse,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "An error occurred while creating the course." });
    }
};


export const fetchCourses = async (req, res) => {
    const { tutorId } = req.body;

    // Validate input
    if (!tutorId) {
        return res.status(400).json({ error: "Tutor ID is required." });
    }

    try {
        // Fetch all courses with the specified tutorId
        const courses = await Course.find({ tutor: tutorId }).populate({
            path: 'modules',
            populate: [
                {
                    path: 'lessons',
                    populate: { path: 'topics' }
                },
                { path: 'quizzes' }
            ]
        });

        // Return the courses in the response
        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "An error occurred while fetching courses." });
    }
};
