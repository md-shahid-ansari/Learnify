import React from 'react';
import { Outlet} from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const AdminHome = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow pt-16 overflow-auto thin-scrollbar">
          <Outlet />
        </main>
      <Footer />
    </div>
    );
};

export default AdminHome;
