import React from 'react';
import './NEET.css';

const NEET = () => {
    return (
        <div className="neet-page">
           
            <div className="slogan-section">
                <h1>Turn Your Medical Aspirations into Reality</h1>
                <p>—Where Future Doctors Begin Their Journey!</p>
            </div>

           
            <div className="dates-section">
                <h2>Important NEET 2025 Dates</h2>
                <ul className="dates-list">
                    <li>Application Form Release: January 2025</li>
                    <li>Last Date to Submit Form: March 2025</li>
                    <li>Admit Card Release: April 2025</li>
                    <li>NEET Exam Date: May 2025</li>
                    <li>Results Announcement: June 2025</li>
                </ul>
            </div>

            <div className="test-section">
                <h2>Mock Tests for NEET 2025</h2>
                <div className="test-grid">
                    <div className="test-box">
                        <h3>Test 1</h3>
                        <button className="take-test-btn">Take Test</button>
                    </div>
                    <div className="test-box">
                        <h3>Test 2</h3>
                        <button className="take-test-btn">Take Test</button>
                    </div>
                    <div className="test-box">
                        <h3>Test 3</h3>
                        <button className="take-test-btn">Take Test</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NEET;
