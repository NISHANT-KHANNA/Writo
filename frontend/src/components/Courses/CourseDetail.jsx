import React from "react";
import {useParams} from "react-router-dom";
import carousel from './carousel.png';
// import {CourseData} from "./CourseData.jsx";
import { coursesData } from "./coursesData";
import meeting from './meeting.png';
import resources from './resources.png';
import sessions from './sessions.png';
import doubts from './doubts.png';

import './CourseDetail.css';
const CourseDetail = () => {
  const { courseId } = useParams(); // Get the dynamic parameter
  const course = coursesData[courseId]; // Fetch course data based on courseId
 
 return (
  <> 
  <div className="container"> 
  <img src={carousel} alt="carousel" className="carousel" />
  <div className="heading">
      <h1>{course.heading}</h1>
      <p>{course.tag}</p>
  </div>
  <div className="course-content">
    <div className="left-column">
      <h3>{course.name}</h3>
      <p>{course.description}</p>
      <div className="pic-section">
          <div className="pic-item">
            <img src={sessions} alt="Image 1" className="pic" />
            <p className="caption">LIVE Interactive Sessions</p>
          </div>
          <div className="pic-item">
            <img src={doubts} alt="Image 2" className="pic" />
            <p className="caption">Solve doubts after class</p>
          </div>
          <div className="pic-item">
            <img src={resources} alt="Image 3" className="pic" />
            <p className="caption">Digital Learning Resources</p>
          </div>
          <div className="pic-item">
            <img src={meeting} alt="Image 4" className="pic" />
            <p className="caption">Parent Teacher Meeting</p>
          </div>
      </div>

      <div className="subjects-main-container">
      <h4>Subjects Covered:</h4>
      <div className="subjects-container">
      {course.subjects.map((subject, index) => (
      <div key={index} className="subject-item">
        {subject}
      </div>
      
     
      
    ))}
  </div>
  </div>
     <div className="language-container">
      <h4>Language:</h4>
      <div className="language">{course.language}</div>
      </div>
    </div>

    <div className="right-column">
    <img src={course.image} alt="jeeee" />
    </div>
  </div> 
  </div>
  </>
  );
};

export default CourseDetail;