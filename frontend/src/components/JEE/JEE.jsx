import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './JEE.css';


const JEE = () => {
    const [userData,setUserData] = useState(null);
    const navigate = useNavigate();  
    
   useEffect(()=>{
       const storedUserData = localStorage.getItem("user");
       setUserData(JSON.parse(storedUserData)); 
   },[]);


    // const handleTestClick = async(testBox) => {
    //     try{
    //     const {userId,username,course}=userData;
    //     const testId = `t${testBox}`;  
    //     const response = await axios.post("http://localhost:5000/startTest",{
    //         userId,username,course,testId});

    //     if(response.status===200){
    //         alert(response.data.message);
    //         navigate(`/${course}/${testId}`);
    //     }
    // }
    //     catch(error){
    //        alert(error.response ? error.response.data : 'Attempted Before');
    //     }
        

    // };
   const handleTestClick = async(testBox) => {
        try{
        const {userId,username,course}=userData;
        console.log(userId);
        const testId = `T${testBox}`;  
        const response = await axios.post("http://localhost:5000/startTest2",{
            userId,username,course,testId});

        if(response.status===200){
            alert(response.data.message);
            navigate('/instruction', { state: { course,testId } });
            // navigate(`/${course}/${testId}`);
        }
    }
        catch(error){
           alert(error.response ? error.response.data : 'Attempted Before');
        }
        

    };
    return (
        <div className="jee-page">
            <div className="slogan-section">
                <h1>Unlock the Doors to IITs</h1>
                <p>—Where Excellence Meets Opportunity!</p>
            </div>

            <div className="dates-section">
                <h2>Important JEE 2025 Dates</h2>
                <ul className="dates-list">
                    <li>Application Form Release: November 2024</li>
                    <li>Last Date to Submit Form: December 2024</li>
                    <li>Admit Card Release: March 2025</li>
                    <li>JEE Main Exam Date: April 2025</li>
                    <li>JEE Advanced Exam Date: June 2025</li>
                    <li>Results Announcement: July 2025</li>
                </ul>
            </div>

        
            <div className="test-section">
                <h2>Mock Tests for JEE 2025</h2>
                <div className="test-grid">
                    <div className="test-box">
                        <h3>Test 1</h3>
                        <button className="take-test-btn" onClick={() => handleTestClick(1)}>Take Test</button>
                    </div>
                    <div className="test-box">
                        <h3>Test 2</h3>
                        <button className="take-test-btn" onClick={() => handleTestClick(2)}>Take Test</button>
                    </div>
                    <div className="test-box">
                        <h3>Test 3</h3>
                        <button className="take-test-btn" onClick={() => handleTestClick(3)}>Take Test</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JEE;


