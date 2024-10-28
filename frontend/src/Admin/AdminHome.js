import React from 'react';
import { Outlet} from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer';
import Header from './Header';

const AdminHome = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
    );
};

export default AdminHome;
