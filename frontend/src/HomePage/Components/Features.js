import React, { useRef, useEffect } from 'react';
import './Features.css';
import alpha from '../assets/alpha.png';
import beta from '../assets/beta.jpg';
import gamma from '../assets/gamma.webp';
import delta from '../assets/Project_Delta.webp';
import epsilon from '../assets/epsilon.png';

// Sample project data with image URLs
const projectData = [
    {
        id: 1,
        name: 'Project Alpha',
        description: 'An innovative solution for optimizing logistics.',
        company: 'Company A',
        imageUrl: alpha, // Directly use the imported image
    },
    {
        id: 2,
        name: 'Project Beta',
        description: 'A platform for enhancing remote teamwork.',
        company: 'Company B',
        imageUrl: beta, // Directly use the imported image
    },
    {
        id: 3,
        name: 'Project Gamma',
        description: 'A cutting-edge app for personal finance management.',
        company: 'Company C',
        imageUrl: gamma, // Directly use the imported image
    },
    {
        id: 4,
        name: 'Project Delta',
        description: 'A tool for streamlining customer feedback processes.',
        company: 'Company D',
        imageUrl: delta, // Directly use the imported image
    },
    {
        id: 5,
        name: 'Project Epsilon',
        description: 'A solution for improving online education experiences.',
        company: 'Company E',
        imageUrl: epsilon, // Directly use the imported image
    },
];

const Features = () => {
    const scrollRef = useRef(null);

    // Auto scroll every 5 seconds
    useEffect(() => {
        const scrollInterval = setInterval(() => {
            scrollRight();
        }, 5000);

        return () => clearInterval(scrollInterval); // Clean up the interval on component unmount
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -320, // Adjust scroll distance based on card width
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            // If at the end, reset the scroll position to create a looping effect
            if (scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >= scrollRef.current.scrollWidth) {
                scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollBy({
                    left: 350, // Adjust scroll distance based on card width
                    behavior: 'smooth',
                });
            }
        }
    };

    return (
        <div className="features-container">
            <h2>Project Overview</h2>
            <div className="features-wrapper">
                <button className="scroll-button left" onClick={scrollLeft}>
                    &#8249;
                </button>
                <div className="features-scroll" ref={scrollRef}>
                    {projectData.map((project, index) => (
                        <div key={index} className="feature-card">
                            <img src={project.imageUrl} alt={project.name} className="project-image" />
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <small>{project.company}</small>
                            <button className="register-button">Register</button>
                        </div>
                    ))}
                </div>
                <button className="scroll-button right" onClick={scrollRight}>
                    &#8250;
                </button>
            </div>
        </div>
    );
};

export default Features;
