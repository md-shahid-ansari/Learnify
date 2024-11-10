import React, { useEffect, useState } from 'react';
import { IsAdminSessionLive } from '../utils/IsAdminSessionLive';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../Toast/toasts';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [courses, setCourses] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const authenticate = async () => {
            const { isAuthenticated } = await IsAdminSessionLive();

            if (!isAuthenticated) {
                showErrorToast('You are not authenticated. Please log in again.');
                navigate('/login-page');
                setLoading(false);
                return;
            }
            await fetchData();
            setLoading(false);
        };

        authenticate();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [
                studentsResponse,
                adminsResponse,
                certificatesResponse,
                coursesResponse,
                tutorsResponse,
                enrollmentsResponse,
            ] = await Promise.all([
                axios.post(`${URL}/api/auth/get-all-students`),
                axios.post(`${URL}/api/auth/get-all-admins`),
                axios.post(`${URL}/api/auth/get-all-certificates`),
                axios.post(`${URL}/api/auth/get-all-courses`),
                axios.post(`${URL}/api/auth/get-all-tutors`),
                axios.post(`${URL}/api/auth/get-all-enrollments`), // Fetching enrollments once
            ]);

            setEnrollments(enrollmentsResponse.data.enrollments);
            setAdmins(adminsResponse.data.admins);
            setCertificates(certificatesResponse.data.certificates);
            setCourses(coursesResponse.data.courses);
            setTutors(tutorsResponse.data.tutors);
            setStudents(studentsResponse.data.students); // Setting the students (enrollment) data
            // console.log(enrollmentsResponse.data.enrollments,
            //     adminsResponse.data.admins,
            //     certificatesResponse.data.certificates,
            //     coursesResponse.data.courses,
            //     tutorsResponse.data.tutors,
            //     studentsResponse.data.students);
        } catch (error) {
            showErrorToast('Failed to fetch data. Please try again later.');
        }
    };

    const handleDelete = async (id, type) => {
        try {
            const response = await axios.post(`${URL}/api/auth/delete-batch`, { type , id });
            if (response.status === 200) {
                showSuccessToast(`${type} deleted successfully.`);
                fetchData(); // Re-fetch data to reflect the changes
            }
        } catch (error) {
            showErrorToast(`Failed to delete ${type}. Please try again.`);
        }
    };

    if (loading)
        return (
            <p className="text-center text-indigo-500 text-xl font-semibold animate-pulse mt-10">
                Loading...
            </p>
        );

    return (
        <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Manage Enrollments Section */}
            <section className="manage-enrollments mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Enrollments</h2>
                {enrollments.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Student Name</th>
                                <th className="py-2 px-4 text-left">Course Title</th>
                                <th className="py-2 px-4 text-left">Progress</th>
                                <th className="py-2 px-4 text-left">Enrollment Date</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{enrollment.studentId.name}</td>
                                    <td className="py-2 px-4">{enrollment.courseId.title}</td>
                                    <td className="py-2 px-4">{enrollment.progress}%</td>
                                    <td className="py-2 px-4">
                                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(enrollment._id, 'enrollment')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No enrollments to manage at the moment.</p>
                )}
            </section>


            {/* Manage Courses Section */}
            <section className="manage-courses mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
                {courses.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Course Title</th>
                                <th className="py-2 px-4 text-left">Description</th>
                                <th className="py-2 px-4 text-left">Tutor Name</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{course.title}</td>
                                    <td className="py-2 px-4">{course.description}</td>
                                    <td className="py-2 px-4">{course.tutor.name}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(course._id, 'course')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No courses available at the moment.</p>
                )}
            </section>

            {/* Manage Certificates Section */}
            <section className="manage-certificates mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Certificates</h2>
                {certificates.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Certificate Name</th>
                                <th className="py-2 px-4 text-left">Issued To</th>
                                <th className="py-2 px-4 text-left">Course</th>
                                <th className="py-2 px-4 text-left">Date Issued</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map((certificate, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{certificate.title}</td>
                                    <td className="py-2 px-4">{certificate.earnedBy.name}</td>
                                    <td className="py-2 px-4">{certificate.course.title}</td>
                                    <td className="py-2 px-4">
                                        {new Date(certificate.dateEarned).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(certificate._id, 'certificate')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No certificates available at the moment.</p>
                )}
            </section>



            {/* Manage Students Section */}
            <section className="manage-students mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
                {students.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{student.studentId}</td>
                                    <td className="py-2 px-4">{student.name}</td>
                                    <td className="py-2 px-4">{student.email}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(student._id, 'student')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No students available at the moment.</p>
                )}
            </section>


            {/* Manage Tutors Section */}
            <section className="manage-tutors mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Tutors</h2>
                {tutors.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tutors.map((tutor, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{tutor.tutorId}</td>
                                    <td className="py-2 px-4">{tutor.name}</td>
                                    <td className="py-2 px-4">{tutor.email}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(tutor._id, 'tutor')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No tutors available at the moment.</p>
                )}
            </section>


            {/* Manage Admins Section */}
            <section className="manage-admins mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Admins</h2>
                {admins.length > 0 ? (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Contact Number</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="py-2 px-4">{admin.adminId}</td>
                                    <td className="py-2 px-4">{admin.adminName}</td>
                                    <td className="py-2 px-4">{admin.role}</td>
                                    <td className="py-2 px-4">{admin.email}</td>
                                    <td className="py-2 px-4">{admin.contactNumber || 'N/A'}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(admin._id, 'admin')}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No admins to manage at the moment.</p>
                )}
            </section>

        </div>
    );
};

export default AdminDashboard;
