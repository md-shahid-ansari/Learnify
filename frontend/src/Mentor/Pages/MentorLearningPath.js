import React, { useState } from 'react';
import CourseForm from '../components/CourseForm'; // Course component to handle the course-level actions

const MentorLearningPath = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [certificates, setCertificates] = useState(['']);
    const [courses, setCourses] = useState([]);

    const handleAddCourse = () => {
        setCourses([...courses, { title: '', modules: [] }]);
    };

    const handleCourseChange = (index, updatedCourse) => {
        const updatedCourses = courses.map((course, i) => i === index ? updatedCourse : course);
        setCourses(updatedCourses);
    };

    const handleRemoveCourse = (index) => {
        const updatedCourses = courses.filter((_, i) => i !== index);
        setCourses(updatedCourses);
    };

    const handleAddCertificate = () => {
        setCertificates([...certificates, '']);
    };

    const handleCertificateChange = (index, value) => {
        const updatedCertificates = certificates.map((cert, i) => i === index ? value : cert);
        setCertificates(updatedCertificates);
    };

    const handleRemoveCertificate = (index) => {
        const updatedCertificates = certificates.filter((_, i) => i !== index);
        setCertificates(updatedCertificates);
    };

    const handleSubmit = () => {
        if (!title || !description || courses.length === 0) {
            alert("Please provide a title, description, and at least one course.");
            return;
        }

        const learningPathData = {
            title,
            description,
            certificates,
            courses
        };

        console.log("Learning Path submitted:", learningPathData);
        alert("Learning Path submitted successfully!");
        // You can also make a POST request to a server here with the learningPathData.
    };

    return (
        <div>
            <h2>Create Mentor Learning Path</h2>
            
            {/* Learning Path Title */}
            <div>
                <label>Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter Learning Path Title"
                />
            </div>

            {/* Learning Path Description */}
            <div>
                <label>Description:</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter Learning Path Description"
                />
            </div>

            {/* Certificates */}
            <div>
                <label>Certificates:</label>
                {certificates.map((cert, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            value={cert} 
                            onChange={(e) => handleCertificateChange(index, e.target.value)} 
                            placeholder="Enter Certificate Name"
                        />
                        <button onClick={() => handleRemoveCertificate(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddCertificate}>Add Certificate</button>
            </div>

            {/* Courses */}
            <div>
                <h3>Courses</h3>
                {courses.map((course, index) => (
                    <div key={index}>
                        <CourseForm 
                            index={index} 
                            course={course} 
                            onCourseChange={handleCourseChange} 
                        />
                        <button onClick={() => handleRemoveCourse(index)}>Remove Course</button>
                    </div>
                ))}
                <button onClick={handleAddCourse}>Add Course</button>
            </div>

            {/* Submit Learning Path */}
            <button onClick={handleSubmit} style={{ marginTop: '20px' }}>Submit Learning Path</button>
        </div>
    );
};

export default MentorLearningPath;
