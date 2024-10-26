import React, { useState, useEffect } from 'react';
import './StudentProfileSettings.css'; // Ensure to create and style this CSS file

// Custom hook to simulate fetching student data
const useFetchStudentData = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate an API call
        const fetchData = async () => {
            try {
                // Simulate a delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Mock student data
                const mockData = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    profilePicture: 'https://via.placeholder.com/150',
                    contact: '+1234567890'
                };
                setStudent(mockData);
            } catch (err) {
                setError('Failed to fetch student data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { student, loading, error };
};

const StudentProfileSettings = () => {
    const { student, loading, error } = useFetchStudentData();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (student) {
            setName(student.name);
            setEmail(student.email);
            setProfilePicture(student.profilePicture);
            setContact(student.contact);
        }
    }, [student]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle form submission
        console.log({
            name,
            email,
            password,
            profilePicture,
            contact,
        });
        alert('Profile updated successfully');
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result); // Set the preview of the profile picture
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="profile-settings">
            <h1>Profile Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <div className="profile-picture-preview">
                        <img src={profilePicture} alt="Profile" />
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
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact">Contact Number</label>
                    <input 
                        type="tel" 
                        id="contact" 
                        value={contact} 
                        onChange={(e) => setContact(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="save-button">Save Changes</button>
            </form>
        </div>
    );
};

// Example Usage
const App = () => {
    return (
        <div className="app">
            <StudentProfileSettings />
        </div>
    );
};

export default App;
