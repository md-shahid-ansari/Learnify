import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Ensure Header component exists
import Footer from './Footer'; // Ensure Footer component exists

const TutorHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
};

export default TutorHome;
