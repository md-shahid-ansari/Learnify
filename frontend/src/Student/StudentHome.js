import React from 'react';
import StudentSidebar from './StudentSidebar';
import { Outlet} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';



const StudentHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentHome;
