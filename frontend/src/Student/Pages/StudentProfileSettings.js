import React, { useState, useEffect } from 'react';

const useFetchStudentData = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
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
            setProfilePicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Profile Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center">
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                    />
                    <input
                        type="file"
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                        className="mt-2 text-sm text-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Contact Number</label>
                    <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default StudentProfileSettings;
