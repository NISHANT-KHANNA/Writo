import React from 'react';
import './index.css'; 
// import CourseDetail from "./CourseDetail";

import jee from './jee.png';
import neet from './neet.png';
import twelve from './twelve.png';
import tenth from './tenth.png';
import { useNavigate } from 'react-router-dom';


const Courses = () => {
    const navigate = useNavigate();
    return (
        <div className="courses-container">
            <h1 className='courses-heading'>Courses / Exams</h1>
            <div className="courses-grid">
                <div className="course-item neet" onClick={() => navigate('/course/neet')}> 
                    <img src={neet} alt="NEET" className="course-icon" />
                    <h2>NEET UG</h2>
                    <p>Crack NEET and Secure a seat in AIMS  by achieving top ranks!</p>
                </div>
                <div className="course-item jee" onClick={() => navigate('/course/jee')}>
                    <img src={jee} alt="JEE" className="course-icon" />
                    <h2>IIT JEE</h2>
                    <p>For those who want only IIT & nothing else!</p>
                </div>
                <div className="course-item twelve" onClick={() => navigate('/course/class12')}>
                    <img src={twelve} alt="12th" className="course-icon" />
                    <h2>Class 12th</h2>
                    <p>Excel in Your Finals, and Open Doors to Endless Opportunities</p>
                </div>
                <div className="course-item ten" onClick={() => navigate('/course/class10')}>
                    <img src={tenth} alt="10th" className="course-icon" />
                    <h2>Class 10th</h2>
                    <p>Master Your Subjects, and Pave the Way for Future Success</p>
                </div>
            </div>
        </div>
    );
};

export default Courses;