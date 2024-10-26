import React from 'react';
import Header from './Components/Header';
import HeroSection from './Components/HeroSection';
import Features from './Components/Features';
import Testimonials from './Components/Testimonials';
import Footer from './Components/Footer';


const LandingPage = () => {
    return (
        <div className="landing-page">
            <Header/>
            <HeroSection/>
            <Features/>
            <Testimonials/>
            <Footer/>
        </div>
    );
};

export default LandingPage;
