import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './Instruction.css';
import { HiInformationCircle } from "react-icons/hi2";
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from 'react-icons/io5'; // Import the icons


const Instruction = ()=>{
    const location = useLocation(); // Get data passed from the previous page
    const navigate = useNavigate(); // Hook to navigate between routes
    const {course,testId } = location.state; // Extract object
  
    const handleSubmit=()=>{
;        navigate(`/${course}/${testId}`);

    };

	return(
      <>
        <div className="instruction-page">
            <div className="header">
                <h1>Information Bulletin <HiInformationCircle /></h1>
            </div>
            <div className="instruction-content">
                <h1>General Instruction Page</h1>
                <p>Please read the instructions carefully</p>

                <h2>General Instructions:</h2>
                <ol>
                    <li>Total duration of examination is 60 minutes.</li>
                    <li>
                    The clock will be set at the server. The countdown timer in the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end automatically. You will not be required to end or submit your exam.
                    </li>
                    <li>
                    The Question Palette displayed on the right side of the screen will show the status of each question using one of the following symbols:
                    <ul class="status-symbols">
                        <li><span class="symbol not-visited"></span> You have not visited the question yet.</li>
                        <li><span class="symbol not-answered"></span> You have not answered the question.</li>
                        <li><span class="symbol answered"></span> You have answered the question.</li>
                        
                    </ul>
                    </li>
                
                    <li>
                    To change your answer, simply select a new option. 
                    </li>
                    <li>
                        You can click on the <IoArrowForwardCircleOutline className="next-icon" /> icon to move to the next question and
                        <IoArrowBackCircleOutline className="prev-icon" /> icon to move back to the previous question.
                    </li>

                </ol>
                <button onClick ={handleSubmit}>I Agree</button>
            </div>
            
       
        </div> 
      </>

		)
};

export default Instruction;