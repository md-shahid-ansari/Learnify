// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm">&copy; 2024 Learnify By Academix. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook text-xl hover:text-blue-500"></i>
          </a>
          <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter text-xl hover:text-blue-400"></i>
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin text-xl hover:text-blue-600"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
