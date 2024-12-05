
import React from 'react';
import './style.css'; 
import ranks from './ranks.png';
import solutions from './solutions.png';
import test from './test.png';
import practice from './practice.png';

const Services = () => {
  return (
    <div className="services-container">
      <h1 className="services-heading">What Our Test Series Offers?</h1>
      <div className="services-grid">
      <div className="service-box rank">
        <img src={ranks} alt="Ranks" className="service-icon" />
          <h2>Ranks</h2>
          <p>All India ranks for benchmarking performance. Opportunity to know where you stand among everyone.</p>
        </div>
        <div className="service-box soln">
          <img src={solutions} alt="Solutions" className="service-icon" />
          <h2>Solutions</h2>
          <p>We provide comprehensive solutions and in-depth performance analysis to help you excel and achieve top ranks.</p>
        </div>
        <div className="service-box prac">
        `<img src={practice} alt="Practice" className="service-icon" />
          <h2>Practice</h2>
          <p>Access over 5,000 practice questions designed to boost your score and sharpen your skills.</p>
        </div>
        <div className="service-box test">
          <img src={test} alt="Previous year" className="service-icon" />
          <h2>Previous year</h2>
          <p>Review and practice previous year papers to master exam patterns and enhance your preparation.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
