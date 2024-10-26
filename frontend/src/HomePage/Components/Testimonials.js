import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonials = [
    {
        name: 'John Doe',
        role: 'Software Engineer',
        text: 'This platform has been a game-changer in how I work with students. Amazing experience!',
    },
    {
        name: 'Jane Smith',
        role: 'Product Manager',
        text: 'The best way to bridge the gap between industry and students. Highly recommend Academix!',
    },
    {
        name: 'Mark Wilson',
        role: 'UX Designer',
        text: 'I loved the real-world project experience and the opportunity to contribute to meaningful tasks.',
    },
];

const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="testimonial-carousel">
            <div className="testimonial-slide">
                <p className="testimonial-text">"{testimonials[currentIndex].text}"</p>
                <h4 className="testimonial-name">{testimonials[currentIndex].name}</h4>
                <p className="testimonial-role">{testimonials[currentIndex].role}</p>
            </div>

            <div className="testimonial-dots">
                {testimonials.map((_, idx) => (
                    <span
                        key={idx}
                        className={`dot ${currentIndex === idx ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default TestimonialCarousel;
