import React, { useState } from 'react';
import './MentorProfileSettings.css'; // Ensure to create and style this CSS file

const MentorProfileSettings = () => {
    // Sample mentor details
    const [mentor, setMentor] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
        profilePicture: 'https://via.placeholder.com/150', // Placeholder image
        contact: '+1234567890',
        bio: 'Experienced mentor in software development.',
        linkedin: 'https://www.linkedin.com/in/johndoe/',
        expertise: 'JavaScript, React, Node.js',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMentor((prevMentor) => ({
            ...prevMentor,
            [name]: value,
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setMentor((prevMentor) => ({
                ...prevMentor,
                profilePicture: reader.result, // Set the preview of the profile picture
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(mentor);
        alert('Profile updated successfully');
    };

    return (
        <div className="profile-settings">
            <h1>Mentor Profile Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <div className="profile-picture-preview">
                        {mentor.profilePicture && <img src={mentor.profilePicture} alt="Profile" />}
                    </div>
                    <input 
                        type="file" 
                        id="profilePicture" 
                        onChange={handleProfilePictureChange} 
                        accept="image/*"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={mentor.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={mentor.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={mentor.password} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact">Contact Number</label>
                    <input 
                        type="tel" 
                        id="contact" 
                        name="contact"
                        value={mentor.contact} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={mentor.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Write a brief bio"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn Profile</label>
                    <input 
                        type="url" 
                        id="linkedin" 
                        name="linkedin"
                        value={mentor.linkedin} 
                        onChange={handleChange} 
                        placeholder="LinkedIn URL"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="expertise">Areas of Expertise</label>
                    <input
                        type="text"
                        id="expertise"
                        name="expertise"
                        value={mentor.expertise} 
                        onChange={handleChange}
                        placeholder="Enter expertise areas separated by commas"
                    />
                </div>

                <button type="submit" className="save-button">Save Changes</button>
            </form>
        </div>
    );
};

export default MentorProfileSettings;
