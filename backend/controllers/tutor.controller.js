import {Course} from '../models/course.model.js';
import {Module} from '../models/module.model.js';
import {Lesson} from '../models/lesson.model.js';
import {Quiz} from '../models/quiz.model.js';
import {Topic} from '../models/topic.model.js';
import {Tutor} from '../models/tutor.model.js';

import multer from 'multer';
import { bucket } from '../db/connectDb.js'; // Import the GridFS instance
import { Readable } from 'stream';
import mongoose from 'mongoose';

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


export const getFile = async (req, res) => {
    const { fileId } = req.params;

    if (!fileId) {
        return res.status(400).json({ error: "File ID is required." });
    }

    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (error) => {
            console.error("Error streaming file:", error);
            res.status(500).json({ error: "An error occurred while streaming the file." });
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error retrieving file:", error);
        res.status(500).json({ error: "An error occurred while retrieving the file." });
    }
};

// Helper function to generate URLs for GridFS images
const URL = process.env.REACT_APP_BACKEND_URL;
const getImageUrl = (fileId) => `${URL}/api/auth/files/${fileId}`;

export const fetchCourses = async (req, res) => {
    const { tutorId } = req.body;

    // Validate input
    if (!tutorId) {
        return res.status(400).json({ error: "Tutor ID is required." });
    }

    try {
        // Fetch courses with populated structure but without attempting to populate GridFS files
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

        // Map through each course to attach image URLs
        const coursesWithImages = await Promise.all(courses.map(async (course) => {
            const modules = await Promise.all(course.modules.map(async (module) => {
                const lessons = await Promise.all(module.lessons.map(async (lesson) => {
                    const topics = await Promise.all(lesson.topics.map(async (topic) => {
                        // Attach GridFS image URLs for each image in topic.images
                        const imagesWithUrls = topic.images.map((image) => ({
                            ...image.toObject(),
                            previewUrl: getImageUrl(image.fileId)
                        }));
                        return { ...topic.toObject(), images: imagesWithUrls };
                    }));
                    return { ...lesson.toObject(), topics };
                }));
                return { ...module.toObject(), lessons };
            }));
            return { ...course.toObject(), modules };
        }));

        // Send the modified response with URLs included
        res.status(200).json({
            success: true,
            courses: coursesWithImages,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "An error occurred while fetching courses." });
    }
};
 

export const deleteCourse = async (req, res) => {
    const { courseId } = req.body;

    // Validate input
    if (!courseId) {
        return res.status(400).json({ error: "Course ID is required." });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        // Iterate through modules to delete lessons, topics, quizzes, and images
        for (const moduleId of course.modules) {
            const module = await Module.findById(moduleId);

            if (module) {
                // Delete lessons within the module
                for (const lessonId of module.lessons) {
                    const lesson = await Lesson.findById(lessonId);

                    if (lesson) {
                        // Delete topics within the lesson
                        for (const topicId of lesson.topics) {
                            const topic = await Topic.findById(topicId);

                            if (topic) {
                                // Delete images associated with each topic in GridFS
                                for (const image of topic.images) {
                                    await bucket.delete(new mongoose.Types.ObjectId(image.fileId));
                                }

                                // Delete the topic itself
                                await topic.deleteOne();
                            }
                        }

                        // Delete the lesson itself
                        await lesson.deleteOne();
                    }
                }

                // Delete quizzes within the module
                for (const quizId of module.quizzes) {
                    await Quiz.findByIdAndDelete(quizId);
                }

                // Delete the module itself
                await module.deleteOne();
            }
        }

        // Delete the course itself
        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course and all associated data deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "An error occurred while deleting the course." });
    }
};

export const updateCourse = async (req, res) => {
    const { course, tutorId } = req.body;

    if (!course || !course.title || !course.description) {
        return res.status(400).json({ error: "Course ID, title, and description are required." });
    }

    try {
        // Find and update the main course fields, or create a new course if needed
        let updatedCourse = course._id 
            ? await Course.findByIdAndUpdate(course._id, {
                title: course.title,
                description: course.description,
                certificate: course.certificate,
                tutor: tutorId,
            }, { new: true })
            : new Course({
                title: course.title,
                description: course.description,
                certificate: course.certificate,
                tutor: tutorId,
            });

        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found." });
        }

        const moduleIds = [];
        const lessonIds = [];
        const topicIds = [];
        const quizIds = [];

        for (const moduleData of course.modules) {
            let module;

            // Update or create Module
            if (moduleData._id) {
                module = await Module.findByIdAndUpdate(moduleData._id, {
                    title: moduleData.title,
                    description: moduleData.description,
                }, { new: true });
            } else {
                module = new Module({
                    title: moduleData.title,
                    description: moduleData.description,
                });
                await module.save();
                updatedCourse.modules.push(module._id);
            }
            moduleIds.push(module._id);

            for (const lessonData of moduleData.lessons) {
                let lesson;

                // Update or create Lesson
                if (lessonData._id) {
                    lesson = await Lesson.findByIdAndUpdate(lessonData._id, {
                        title: lessonData.title,
                        description: lessonData.description,
                    }, { new: true });
                } else {
                    lesson = new Lesson({
                        title: lessonData.title,
                        description: lessonData.description,
                    });
                    await lesson.save();
                    module.lessons.push(lesson._id);
                }
                lessonIds.push(lesson._id);

                for (const topicData of lessonData.topics) {
                    let topic;

                    // Update or create Topic
                    if (topicData._id) {
                        topic = await Topic.findByIdAndUpdate(topicData._id, {
                            title: topicData.title,
                            content: topicData.content,
                            learningOutcomes: topicData.learningOutcomes,
                            links: topicData.links,
                        }, { new: true });

                        // Handle image deletion and update
                        const existingImageIds = topic.images.map(image => image.fileId.toString());
                        const updatedImageIds = topicData.images.map(image => image.fileId);

                        const imagesToDelete = existingImageIds.filter(id => !updatedImageIds.includes(id));
                        for (const imageId of imagesToDelete) {
                            await bucket.delete(new mongoose.Types.ObjectId(imageId));
                        }

                        topic.images = topicData.images.map(image => ({
                            title: image.title,
                            fileId: image.fileId,
                            filename: image.filename,
                        }));
                    } else {
                        topic = new Topic({
                            title: topicData.title,
                            content: topicData.content,
                            learningOutcomes: topicData.learningOutcomes,
                            images: topicData.images.map(image => ({
                                title: image.title,
                                fileId: image.fileId,
                                filename: image.filename,
                            })),
                            links: topicData.links,
                        });
                        await topic.save();
                        lesson.topics.push(topic._id);
                    }
                    topicIds.push(topic._id);
                    await topic.save();
                }

                await lesson.save();
            }

            for (const quizData of moduleData.quizzes) {
                let quiz;

                // Update or create Quiz
                if (quizData._id) {
                    quiz = await Quiz.findById(quizData._id);

                    if (quiz) {
                        quiz.title = quizData.title;
                        // Ensure quiz.questions is an array
                        quiz.questions = quiz.questions || [];
                        quiz.questions = quizData.questions.map(questionData => {
                            if (questionData._id) {
                                const existingQuestion = quiz.questions.id(questionData._id);
                                if (existingQuestion) {
                                    existingQuestion.questionText = questionData.questionText;
                                    existingQuestion.questionType = questionData.questionType;
                                    existingQuestion.options = questionData.options;
                                    existingQuestion.correctAnswer = questionData.correctAnswer;
                                    return existingQuestion;
                                }
                            }
                            return {
                                questionText: questionData.questionText,
                                questionType: questionData.questionType,
                                options: questionData.options,
                                correctAnswer: questionData.correctAnswer,
                            };
                        });
                        await quiz.save();
                    }
                } else {
                    quiz = new Quiz({
                        title: quizData.title,
                        questions: quizData.questions.map(question => ({
                            questionText: question.questionText,
                            questionType: question.questionType,
                            options: question.options,
                            correctAnswer: question.correctAnswer,
                        })),
                    });
                    await quiz.save();
                    module.quizzes.push(quiz._id);
                }
                quizIds.push(quiz._id);
            }

            await module.save();
        }

        // Delete any modules, lessons, topics, and quizzes that were not in the update
        await Module.deleteMany({ _id: { $nin: moduleIds } });
        await Lesson.deleteMany({ _id: { $nin: lessonIds } });
        await Topic.deleteMany({ _id: { $nin: topicIds } });
        await Quiz.deleteMany({ _id: { $nin: quizIds } });

        await updatedCourse.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            course: updatedCourse,
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "An error occurred while updating the course." });
    }
};


export const getAllCourses = async (req, res) => {
    try {
        // Fetch courses with populated structure but without attempting to populate GridFS files
        const courses = await Course.find().populate({
            path: 'modules',
            populate: [
                {
                    path: 'lessons',
                    populate: { path: 'topics' }
                },
                { path: 'quizzes' }
            ]
        });

        // Map through each course to attach image URLs
        const coursesWithImages = await Promise.all(courses.map(async (course) => {
            const modules = await Promise.all(course.modules.map(async (module) => {
                const lessons = await Promise.all(module.lessons.map(async (lesson) => {
                    const topics = await Promise.all(lesson.topics.map(async (topic) => {
                        // Attach GridFS image URLs for each image in topic.images
                        const imagesWithUrls = topic.images.map((image) => ({
                            ...image.toObject(),
                            previewUrl: getImageUrl(image.fileId)
                        }));
                        return { ...topic.toObject(), images: imagesWithUrls };
                    }));
                    return { ...lesson.toObject(), topics };
                }));
                return { ...module.toObject(), lessons };
            }));
            return { ...course.toObject(), modules };
        }));

        // Send the modified response with URLs included
        res.status(200).json({
            success: true,
            courses: coursesWithImages,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "An error occurred while fetching courses." });
    }
};


export const updateTutor = async (req, res) => {
    const { _id, email, name, bio } = req.body;
    
    // Validate request body
    if (!_id || !email || !name || !bio) {
        return res.status(400).json({
            success: false,
            message: 'All fields (_id, email, name, bio) are required.',
        });
    }

    try {
        // Find and update the tutor record
        const updatedTutor = await Tutor.findByIdAndUpdate(
            _id,
            { email, name, bio },
            { new: true } // Return the updated document
        );

        if (!updatedTutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor not found. Update failed.',
            });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            tutor: updatedTutor,
        });
    } catch (error) {
        // Log and send error response
        console.error('Error updating tutor profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Could not update profile.',
        });
    }
};
