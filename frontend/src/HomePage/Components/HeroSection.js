import React from 'react';
import './HeroSection.css'; // Assuming the CSS is added here
import HeroImg from '../assets/office-workplace.png';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Welcome to Academix</h1>
          <p>Your bridge to real-world projects, connecting students with industry experience.</p>
          <button className="get-started-btn">Get Started</button>
        </div>
        <div className="hero-image">
          <img src={HeroImg} alt="Hero" />
        </div>
      </div> 
    </section>
  );
}

export default HeroSection;
