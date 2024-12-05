import React,{useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Feedback.css'; // Import the Feedback.css for styling
import { IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print"; // Import useReactToPrint
import writo from './writo.png';
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';    

const Feedback = () => {
    const printRef = useRef();// Create a ref for the content to print
    const location = useLocation(); // Get data passed from the previous page
    const navigate = useNavigate(); // Hook to navigate between routes
    const { feedback, score, status, username, course, testId } = location.state; // Extract feedback object
    
     // useReactToPrint hook to handle printing
    const printFn = useReactToPrint({
        contentRef: printRef, // Specify the content to print
        documentTitle: "Test Feedback ", // Set a title for the print document
    });

    // Function to handle navigation back to JEE page
    const handleDone = () => {
        toast.success("Reviewed Test Successfully!!" ,{theme: "dark"});
        setTimeout(() => {
              navigate(`/dashboard`);
        }, 1000)
        // navigate("/dashboard"); // Go back to the previous page
    };

    return (
        <>
          <div ref={printRef} style={{backgroundColor :'#ffffe6'}}> 
            <div className='company-name'>
            <img src={writo} alt="logo" className='logo' />
            <div className='company-text'>
                <h1>Writo Education Pvt. Ltd.</h1>
                <div className='slogan'>
                    <p><i>Making You Future Fit</i></p>
                </div>
            </div>
            </div>
            <div className="feedback-header">
                {/*<h1>Test Feedback</h1>*/}
                <div className="feedback-row">
                   <h2>{username.toUpperCase()}</h2>
                   <IoPrintSharp onClick={printFn} style={{ color:'#4d4d4d',cursor: "pointer"}} size="35"/>
                </div>
                <div className="feedback-row">
                    <h3 className="course">COURSE: {course}</h3>
                    <p className="score">SCORE: {score}/{feedback.length}</p>
                </div>

                <div className="feedback-row">
                    <h3 className="testId">TESTID: {testId.toUpperCase()}</h3>
                    <p>
                    <strong className={status.toLowerCase() === 'passed' ? 'status-passed' : 'status-failed'}>
                        {status}
                    </strong>
                    </p>

                </div>
            </div>
            {feedback.map((question, index) => (
            <div key={question.questionId} className="feedback-card">
                <div className={`question-wrapper ${question.isCorrect ? 'correct-wrapper' : 'incorrect-wrapper'}`}>
                <h4>{index + 1} Out of {feedback.length}</h4>
                {/*<p>{question.question}</p>*/}
                <img
                    src={`http://localhost:5000/uploads/${question.question}`}
                    alt="Question"
                    className="question-image"
                />
                </div>

                {/* Show user's answer in green if correct, red if wrong */}
                <p className={question.isCorrect ? 'correct' : 'incorrect'}>
                Your Answer: {question.userAnswer}
                </p>
                {question.userAnswerImage ?
                <img
                    src={`http://localhost:5000/uploads/${question.userAnswerImage}`}
                    alt="your-answer"
                    className="question-image"
                />:" "}

                {/* Always display the correct answer */}
                <p className="correct">
                Correct Answer: {question.correctAnswer}
                </p>
                <img
                    src={`http://localhost:5000/uploads/${question.correctAnswerImage}`}
                    alt="correct-answer"
                    className="question-image"
                />
            </div>
            ))}


            {/* Done button to return to the previous page */}
            <button className="review-button" onClick={handleDone}>Review</button>
            <ToastContainer />
        </div>
        </>

    );
};

export default Feedback;



