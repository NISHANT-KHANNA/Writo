import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Countdown from "react-countdown";
import axios from 'axios';
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from 'react-icons/io5'; // Import the icons
import './Test.css';
import legend from './legend.png';
import writo from './writo.png';
import { MdAccessTimeFilled } from "react-icons/md";
import { IoMdTimer } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';   

const Test = () => {

    const { testId } = useParams(); 
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for the current question index
    const [questionIds,setQuestionIds] = useState([]); // store question ids 
    const [answers, setAnswers] = useState({}); // State for answers
    const [visitedQuestions, setVisitedQuestions] = useState({}); // Track visited questions
    const [submitted, setSubmitted] = useState(false); // To prevent multiple submissions
    const navigate = useNavigate();
    
    const userData = JSON.parse(localStorage.getItem('user'));
    const username = userData.username;
    const userId = userData.userId;
    const course = userData.course;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.post('http://localhost:5000/fetchQues', { course, testId });
                setQuestions(response.data.questions);
            } catch (error) {
                toast.error(error.response ? error.response.data : 'No Question', { theme: "dark" });
                // alert(error.response ? error.response.data : 'No Question');
            }
        };
        fetchQuestions();
    }, [course, testId]);

    // to extract and save all question ids of a particular exam page
   useEffect(()=>{
         const ids = questions.map((question)=>question._id);
         setQuestionIds(ids);
   },[questions]);

    // Update visited questions when a question is displayed
    useEffect(() => {
        const questionId = questions[currentQuestionIndex]?._id; // Get the current question's ID.
        if (questionId && !visitedQuestions[questionId]) { // If the question has an ID and hasn't been visited yet,
            setVisitedQuestions((prev) => ({ // Update the `visitedQuestions` state
                ...prev, // Spread the existing visited questions
                [questionId]: true, // Mark the current question as visited by setting its ID key to `true`
            }));
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        // Only set the end time once when the component mounts for the first time
        const storedEndTime = localStorage.getItem('testEndTime');
        if (!storedEndTime) {
            const endTime = Date.now() + 120000; // 2 minutes from now
            localStorage.setItem('testEndTime', endTime);
        }
    }, []);
    
    
    
    const handleOptionChange = (optionIndex) => {
    const selectedOption = `Option${optionIndex + 1}`; // Convert index to "Option1", "Option2", etc.
    setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentQuestionIndex]._id]: selectedOption, // Store the selected option as "Option1", "Option2", etc.
    }));
};
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmitTest = async () => {
       
        if (submitted) return; // Prevent multiple submissions
        setSubmitted(true);
        
        try {
            const response = await axios.post('http://localhost:5000/endTest', {
                userId, username, course, testId, answers, questionIds,
            });
            console.log(answers);
            const { feedback, score, status } = response.data;
    
            // Clear the end time from localStorage after test submission
            localStorage.removeItem('testEndTime');
            localStorage.removeItem('testSubmitted'); // Clear submission flag


            navigate('/feedback', { state: { feedback, score, status, username, course, testId } });
        } catch (err) {
            toast.error(err.response.data || 'Error submitting test', { theme: "dark" });
            // alert(err.response.data || 'Error submitting test');
        }
    };
    

   
    const renderer = ({ completed }) => {
    const storedEndTime = localStorage.getItem('testEndTime');
    const timeLeft = storedEndTime ? Math.max(0, storedEndTime - Date.now()) : 0; // Prevent negative values

    if (completed || timeLeft <= 0) {
         if (!submitted) {
                handleSubmitTest();
            }
        // handleSubmitTest(); // Automatically submit the test when time runs out
        return <span>00:00</span>; // Show 0 time left
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return (
        <span>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
    );
};
    
    return (
        <>
        <div className='main-container'>
        <div className='left-container'>
            <div className='company-name'>
            <img src={writo} alt="logo" className='logo' />
            <div className='company-text'>
                <h1>Writo Education Pvt. Ltd.</h1>
                <div className='slogan'>
                    <p><i>Making You Future Fit</i></p>
                </div>
            </div>
            </div>
            <div className='test-header'>
               <div className='test-headings'>
                <h1>{username.toUpperCase()}</h1>
                <h3 className="course">COURSE: {course}</h3>
                <h3>TEST ID: {testId.toUpperCase()}</h3>
                <h4><span>NOTE:</span> Refreshing your page will reset the questions.Best of Luck🤞</h4>
              </div>
              <div className='test-timer'>
                <IoMdTimer className="timer-icon" />

                <Countdown date={parseInt(localStorage.getItem('testEndTime'), 10)} renderer={renderer} />

                {/*<Countdown date={Date.now() + 120000} renderer={renderer} />*/}
              </div>
            </div>

            {questions.length > 0 && (
                <div className="question-wrapper">
                    <div className='question-text'>
                        <h4>{currentQuestionIndex + 1} Out of {questions.length}</h4>
                        <div className="question-detail">
                        <h4 className="question-subject">
                             {questions[currentQuestionIndex].subject} :
                        </h4>
                        <h4 className={`question-level ${questions[currentQuestionIndex].level.toLowerCase()}`}>
                             {questions[currentQuestionIndex].level}
                        </h4>
                        </div>
                             <img
                                    src={`http://localhost:5000/uploads/${questions[currentQuestionIndex].question}`}
                                    alt="Question"
                                    className="question-image"
                                />
      {/*<p>{questions[currentQuestionIndex].question}</p>*/}
                           </div>
                                <div className="options-container">
                            {questions[currentQuestionIndex].options.map((option, i) => {
                                const optionImageURL = `http://localhost:5000/uploads/${option}`; // Assuming images are served from /uploads
                                const selectedOption = `Option${i + 1}`; 
                                return (
                                    <div 
                                        key={i} 
                                        className={`option ${answers[questions[currentQuestionIndex]._id] === selectedOption ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            id={`option-${questions[currentQuestionIndex]._id}-${i}`}
                                            name={`question-${questions[currentQuestionIndex]._id}`}
                                            value={selectedOption}
                                            onChange={() => handleOptionChange(i)}
                                            checked={answers[questions[currentQuestionIndex]._id] === selectedOption} // Control the radio button
                                        />
                                        <label htmlFor={`option-${questions[currentQuestionIndex]._id}-${i}`}>
                                            <img src={optionImageURL} alt={`Option ${i + 1}`} className="option-image" />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>         
                 </div>
             )}
                     <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
                <IoArrowBackCircleOutline 
                    className="prev-icon"
                    onClick={handlePreviousQuestion}
                    size={46}
                />
            )}
             <div className="spacer" /> {/* Spacer for flex alignment */}
            {currentQuestionIndex < questions.length - 1 ? (
                <IoArrowForwardCircleOutline 
                    className="next-icon"
                    onClick={handleNextQuestion}
                    size={46}
                />
            ) : (
                <button onClick={handleSubmitTest}>Submit Test</button>
            )}
        </div>
        </div>
        <div className='right-container'>
        
            <img src={legend} alt="legends" className="legend" />

        <div className="question-navigation">
        {questions.map((question, index) => (
        <div
            key={question._id}
            className={`question-nav-item 
                ${!visitedQuestions[question._id] ? 'not-visited' :
                 answers[question._id] ? 'answered' : 'unanswered'}`}
            onClick={() => setCurrentQuestionIndex(index)}
        >
            {index + 1}
        </div>
                 
        ))}
    </div>

           
        </div>
        <ToastContainer />
    </div>
        </>
    );
};

export default Test;


