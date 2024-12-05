import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AdminDashboard.css';
import user from './user.png';
import question from './question.png';
import test from './test.png';
import writo from './writo.png';
import course from './course.png';
import {Chart as ChartJS} from "chart.js/auto"; 
import {Pie,Bar,Line} from "react-chartjs-2";
import dashboardBg from './dashboardBg.png';

const AdminDashboard = () => { 

  const navigate = useNavigate();
  const [totalUsers,setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userByCourse, setUserByCourse] = useState([]);
  const [questionByCourse, setQuestionByCourse] = useState([]);
  const [testByCourse, setTestByCourse] = useState([]);
  const [userJoined,setUserJoined] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/dashboard');
        setTotalUsers(response.data.totalUsers);
        setTotalCourses(response.data.totalCourses);
        setTotalTests(response.data.totalTests);
        setTotalQuestions(response.data.totalQuestions);
        setUserByCourse(response.data.userByCourse);
        setQuestionByCourse(response.data.questionByCourse);
        setTestByCourse(response.data.testByCourse);
        setUserJoined(response.data.monthlyData);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchDashboardData();
  }, []);

   // Prepare data for the User by Course Pie Chart
  const pieChartData = {
    labels: userByCourse.map((course)=>course._id),
    datasets: [
      {
        data: userByCourse.map((course)=>course.count),
        backgroundColor: ['#FF6B6B', '#4D96FF', '#FFD93D', '#6BCB77','pink','black','grey'],
      },
    ],
  };

  // Prepare data for the Question by Course Bar Chart
  const barChartData = {
    labels: questionByCourse.map((question)=>question._id) ,
    datasets: [
      {
        label:"Question Analytics",
        data: questionByCourse.map((question)=>question.count),
        backgroundColor: [
          '#FF6B6B', // Vivid Red
          '#4D96FF', // Bright Blue
          '#FFD93D', // Warm Yellow
          '#6BCB77','pink','black','grey',
          
        ],
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: userJoined.map((data) => ({
      label: data.course,
      data: data.monthlyCounts,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generates a random color
      fill: false,
      tension: 0.4
    })),
  };

  return (
    <div className="admin-dashboard" style={{ backgroundImage: `url(${dashboardBg})` }}>
      <div className="welcome-section-admin">
        <div className="welcome-image">
          <img src={writo} alt="Welcome" />
        </div>
        <div className="welcome-text">
          <h1>Hello Admin</h1>
          <h3>Making You Future Fit!!!</h3>
        </div>
      </div>
      
      <div className="overview-section">
        <h1>Overview</h1>
        <h3>Track, manage, and view</h3>

        <div className="card-container-admin">
          <div className="card" onClick={() => navigate('/admin/students')}>
            <div className="card-content">
              <div className="card-number">{totalUsers}</div>
              <h3>Total User</h3>
            </div>
            <img src={user} alt="Total User" />
          </div>
          <div className="card" onClick={() => navigate('/courseList')}>
            <div className="card-content">
              <div className="card-number">{totalCourses}</div>
              <h3>Total Course</h3>
            </div>
            <img src={course} alt="Total User" />
          </div>
          
          <div className="card" onClick={() => navigate('/examList')}>
            <div className="card-content">
              <div className="card-number">{totalTests}</div>
              <h3>Total Test</h3>
            </div>
            <img src={test} alt="Total Test" />
          </div>
          <div className="card" onClick={() => navigate('/admin/questions')}>
            <div className="card-content">
              <div className="card-number">{totalQuestions}</div>
              <h3>Total Question</h3>
            </div>
            <img src={question} alt="Total Question" />
          </div>          
        </div>


      <div className='bargraph-container'>
        <div className='bargraph-card'>
          <h2>User Metrics</h2>
          <div className="chart-wrapper">
          <Pie data={pieChartData}  />
          {/*<h4>Legend:</h4>*/}</div>
        </div>

        <div className='bargraph-card'>
          <h2>Question Metrics</h2>
          <div className='chart-wrapper'>
          <Bar data={barChartData}/>
          {/*<h4>Legend:</h4>*/}</div>
        </div>
      </div>

      <div className='linegraph-container'>
        <div className='linegraph-card'>
          <h2>User Reports:</h2>
          <div className='chart-wrapper'>
          <Line data={lineChartData}  />
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

