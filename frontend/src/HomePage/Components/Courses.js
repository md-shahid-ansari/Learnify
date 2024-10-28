// src/pages/Courses.js
import React from "react";

const Courses = () => {
  // Example courses data
  const courses = [
    {
      id: 1,
      title: "Introduction to JavaScript",
      description: "Learn the basics of JavaScript, a popular programming language for web development.",
    },
    {
      id: 2,
      title: "React for Beginners",
      description: "Get started with React, a powerful library for building user interfaces.",
    },
    {
      id: 3,
      title: "Python Programming",
      description: "Explore Python programming and its applications in data science and web development.",
    },
    {
      id: 4,
      title: "Data Structures and Algorithms",
      description: "Learn essential data structures and algorithms to improve coding efficiency.",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
