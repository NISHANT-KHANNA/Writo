import React, { useState,useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import './StudentDashboard.css';
import books from './books.png'; 
import given from './given.png';  
import tests from './tests.png';
import writo from './writo.png';
import student from './student.png';
import {Chart as ChartJS} from "chart.js/auto";
import {Doughnut,Bar} from "react-chartjs-2";
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import dashboardBg from './dashboardBg.png';
import dashboardAd from './dashboardAd.png';


const StudentDashboard = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [course, setCourse] = useState('');
  const [totalTest, setTotalTest] = useState('');
  const [testGiven, setTestGiven] = useState('');
  const [testNotGiven, setTestNotGiven] = useState('');
  const [passedTest, setPassedTest] = useState('');
  const [failedTest, setFailedTest] = useState('');
  
  useEffect(() => {
    // Fetch course and username from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setCourse(userData.course || '');
      setUsername(userData.username || ''); // Set the username if available
      setUserId(userData.userId || ''); // Set the username if available
     
      const fetchDashboardData = async()=>{
       if (userId && course) {
        try{
          const response = await axios.post("http://localhost:5000/getStudentDashboardData",{userId,course});
          setTotalTest(response.data.testCount);
          setTestGiven(response.data.testGiven);
          setTestNotGiven(response.data.testNotGiven);
          setPassedTest(response.data.passedTest);
          setFailedTest(response.data.failedTest);
        }
        catch(error){
          console.log("error fetching tests");
        }
      }
      };
      fetchDashboardData();
      }
    },[userId, course]);


    const doughnutChartData = {
    labels: ["Test Given", "Test Left"],
    datasets: [
      {
        data: [testGiven,testNotGiven],
        backgroundColor: ['#FF6B6B', '#4D96FF'],
        hoverOffset: 4,
        borderRadius:6,

        
        // borderColor:"black",
      },
    ],
  };


 const barChartData = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        label:"Result Analytics",
        data: [passedTest, failedTest],
        backgroundColor: [
          '#FFD93D', // Warm Yellow
          '#6BCB77'  // Fresh Green
        ],
       barThickness:100,
       borderRadius:5,
        
        
      },
    ],
  };





  return (
    <div className="student-dashboard" style={{ backgroundImage: `url(${dashboardBg})` }}>
      {/* Welcome Section */}
      <div className="welcome-section">
        
          <img src={writo} alt="Welcome" className="writo-image" />
        
        <div className="welcome-text">
          <h1>Welcome Back {username.split(" ")[0]}!</h1>
          <h3>Always stay updated in your student portal.</h3>
        </div>
      
        <img src={student} alt="Student" className="student-image" />
      </div>
      
      {/* Overview Section */}
      <div className="overview-section">
        <h1>Overview</h1>
        <h3>Track, manage, and view</h3>

        <div className="overview-columns">
          {/* Column 1 */}
          <div className="column1">
            {/* Row 1: Card Section */}
            <div className="card-container">
              <div className="card">
                <div className="card-content">
                  <div className="card-number">{course}</div>
                  <h3>My Course</h3>
                </div>
                <img src={books} alt="My Course" />
              </div>
              <div className="card">
                <div className="card-content">
                  <div className="card-number">{totalTest}</div>
                  <h3>Total Test</h3>
                </div>
                <img src={tests} alt="Total Test" />
              </div>
              <div className="card">
                <div className="card-content">
                  <div className="card-number">{testGiven}</div>
                  <h3>Tests Given</h3>
                </div>
                <img src={given} alt="Tests Given" />
              </div>
            </div>

            {/* Row 2: Bar Graph Section */}
            <div className="bargraph-container">
              <div className="bargraph-card">
                <h2>Test Metrics</h2>
                <div className='graph-wrapper'>
                <Doughnut data={doughnutChartData}  />
                </div>
                {/* Placeholder for graph */}
              </div>
              <div className="bargraph-card">
                <h2>Passed/Failed Metrics</h2>
                <div className='graph-wrapper'>
                 <Bar data={barChartData}/>
                 </div>
                {/* Placeholder for graph */}
              </div>
            </div>
          </div>

          {/* Column 2: Calendar Section */}
          <div className="column2">
          <div className="calendar">
            <h2>Calendar</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              defaultValue={dayjs()} // Sets to today's date
              views={['year', 'month', 'day']}
            />
            </LocalizationProvider>
            {/* Calendar component or image placeholder */}
          </div>
          <div className="ad-div">
          <a href="https://www.instagram.com/writoeducation/" target="_blank">
              <img src={dashboardAd} alt="dashboardAd" className="dashboardAd" />
          </a>
          </div>
          </div>
          </div>
          <div className='hashtag'>
          <h3>#WritoSeExamsHoJayeAsaan</h3>
          <h4>❤️From Writo Education.</h4>
          </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
