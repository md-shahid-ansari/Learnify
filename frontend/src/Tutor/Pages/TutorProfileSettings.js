import React, { useState } from 'react';

const TutorProfileSettings = () => {
    const [tutor, setTutor] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
        profilePicture: 'https://via.placeholder.com/150',
        contact: '+1234567890',
        bio: 'Experienced tutor in software development.',
        linkedin: 'https://www.linkedin.com/in/johndoe/',
        expertise: 'JavaScript, React, Node.js',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTutor((prevTutor) => ({
            ...prevTutor,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(tutor);
        alert('Profile updated successfully');
    };

    return (
        <div className="flex flex-col items-center py-8 px-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Tutor Profile Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            

                {/* Full Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={tutor.name} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={tutor.email} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={tutor.password} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input 
                        type="tel" 
                        id="contact" 
                        name="contact"
                        value={tutor.contact} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Bio */}
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={tutor.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Write a brief bio"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* LinkedIn Profile */}
                <div className="mb-4">
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                    <input 
                        type="url" 
                        id="linkedin" 
                        name="linkedin"
                        value={tutor.linkedin} 
                        onChange={handleChange} 
                        placeholder="LinkedIn URL"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Areas of Expertise */}
                <div className="mb-4">
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
                    <input
                        type="text"
                        id="expertise"
                        name="expertise"
                        value={tutor.expertise} 
                        onChange={handleChange}
                        placeholder="Enter expertise areas separated by commas"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default TutorProfileSettings;
