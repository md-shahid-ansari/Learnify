import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Academix. All Rights Reserved.</p>
      <div className="social-icons">
        <a href="/"><i className="fab fa-facebook"></i></a>
        <a href="/"><i className="fab fa-twitter"></i></a>
        <a href="/"><i className="fab fa-linkedin"></i></a>
      </div>
    </footer>
  );
};

export default Footer;
