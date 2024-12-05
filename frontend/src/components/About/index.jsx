import React from 'react';
import './index.css'; 
import company from './company.png';
import about from './about.png';
import list from './list.png';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <div className="about-header-row">
                    <h5>ABOUT US</h5>
                    <img src={about} alt="About" className='about-img' />
                </div>
                <h1>Discover Writo Education</h1>
                <p>Connecting you with top educators for personalized, real-time support.</p>
                <ul>
                    <li><img src={list} alt="*"></img>  Access to educators from IITs and NITs.</li>
                    <li><img src={list} alt="*"></img>  Real-time answers to your questions.</li>
                    <li><img src={list} alt="*"></img>  Tailored guidance to suit your needs.</li>
                    <li><img src={list} alt="*"></img>  Holistic learning and support.</li>
                </ul>
            </div>
            <div className="company-img">
                <img src={company} alt="Company" />
            </div>
        </div>
    );
};

export default About;
