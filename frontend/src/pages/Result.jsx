import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./Result.css"; // Importing the CSS file
import { FaPencilRuler } from "react-icons/fa";
import { BiSolidBadgeCheck } from "react-icons/bi"; 
import { MdDangerous } from "react-icons/md";
import { IoMdTimer } from "react-icons/io";
import writo from './writo.png';
import resultpic from './resultpic.png';
import resultBg from './resultBg.png';

const Result = () => {
  const [resultData, setResultData] = useState(null); 
  const [attemptData, setAttemptData] = useState(null);  
   const [error, setError] = useState(null); 

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));  
    
    if (userData && userData.userId) {
      const userId = userData.userId;

      const fetchResult = async () => {
        try {
          const response = await axios.post('http://localhost:5000/fetchResult', { userId });
          setResultData(response.data.result);          
          setAttemptData(response.data.attempt);
        } 
        catch (error) {
          setError("No test Given Yet!");   
        }
      };
      
      fetchResult();
    } else {
      setError("User not logged in or invalid data in localStorage");
    }
  }, []);
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  const testResults=[];
  if(resultData && resultData.results && attemptData && attemptData.attempts){
    resultData.results.forEach((test)=>{
      const attempt = attemptData.attempts.find(attempt=>attempt.test ===test.test);
      
      testResults.push({
      testId: test.test,
      status: test.status,
      score: test.score,
      start: attempt.start,  // Conditionally get the start time
      end: attempt.end       // Conditionally get the end time
    });
    
  });
  }
  
  return (
    
    <div className="result-container" style={{ backgroundImage: `url(${resultBg})` }}>
     <div className='company-name'>
            <img src={writo} alt="logo" className='logo' />
            <div className='company-text'>
                <h1>Writo Education Pvt. Ltd.</h1>
                <div className='slogan'>
                    <p><i>Making You Future Fit</i></p>
                </div>
            </div>
      </div>
      {resultData && (
        <div className="result-header">
          <h2>{resultData.name.toUpperCase()}</h2>
          <h3>COURSE: {resultData.course}</h3>
        </div>
      )}

      
        <div className="test-results">
          {testResults.map((test, index) =>
            test.status ? (
              <div key={index} className="test-card">
                <div className="upper-half" style={{ backgroundImage: `url(${resultpic})` }}></div>
                
                <div className="bottom-half">

                  <div className="test-detail1">
                     <p><strong>Course:</strong> {resultData.course}</p>
                     <p><strong>Test Id:</strong> {test.testId.toUpperCase()}</p>
                  </div>
                  
                  <div className="test-detail2">
                     <p><strong><FaPencilRuler  /> </strong> : {test.score}/10</p>
                     <p>                  
                      {test.status.toLowerCase() === 'passed' ? (
                      <span>
                          <BiSolidBadgeCheck style={{ color: 'green',fontSize:'26px' }} /> Passed
                      </span>
                      ) : (
                      <span>
                         <MdDangerous style={{ color: 'red',fontSize:'26px' }} /> Failed
                      </span>
                      )}
                    </p>
                  </div>

                  <div className="test-detail3">
                   <p className="time-item">
                      <IoMdTimer className="time-icon" />
                      <strong>Start :</strong>
                      {format(new Date(test.start), 'dd/MM/yyyy HH:mm:ss')}
                   </p>
                   <p className="time-item">
                      <IoMdTimer className="time-icon" />
                      <strong>Finish : </strong>
                      {format(new Date(test.end), 'dd/MM/yyyy HH:mm:ss')}
                   </p>
                  </div>
                </div>
            </div>
            ) : null
          )}
        </div>
      
    </div>
  );
};

export default Result;