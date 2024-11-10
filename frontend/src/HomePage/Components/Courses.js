import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const Courses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.post(`${URL}/api/auth/courses`);
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        console.error("Failed to fetch courses:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  // Call fetchCourses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <p className="text-center text-blue-500 text-xl font-semibold animate-pulse mt-10">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
              onClick={() => navigate('/login-page')}  // Redirect to login page on click
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
