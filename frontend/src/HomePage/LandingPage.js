// src/LandingPage.js
import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './Components/Header';
import Footer from './Components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
