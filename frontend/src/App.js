import React from 'react';
import {BrowserRouter , Routes, Route} from "react-router-dom";
import './App.css';  
// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 


import Layout from './pages/Layout';
import AdminLayout from './AdminPanel/AdminLayout';
//import Footer from './components/Footer/index.js'; 
//import Services from './components/Services/index.js';

// import AddQues from './pages/AddQues.jsx';
// import NewTest from './pages/NewTest.jsx';


import Home from './pages/Home/Home.jsx';
import CourseDetail from "./components/Courses/CourseDetail";

import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';


import NEET from './components/NEET/NEET.jsx';
import JEE from './components/JEE/JEE.jsx';

import Test from './pages/Test.jsx'; 
// import Carousel from './pages/Carousel.jsx'; 
import Instruction from './pages/Instruction.jsx'; 
import Feedback from './pages/Feedback.jsx';
import Result from './pages/Result.jsx';

import AdminLogin from './AdminPanel/AdminLogin.jsx';
import AdminSignup from './AdminPanel/AdminSignup.jsx';

import AdminDashboard from './AdminPanel/AdminDashboard.jsx';
// import AdminSidebar from './AdminPanel/AdminSidebar.jsx';
import StudentList from './AdminPanel/StudentList.jsx';
import ScoreBoard from './AdminPanel/ScoreBoard.jsx';
import Questions from './AdminPanel/Questions.jsx';
import CourseList from './AdminPanel/CourseList.jsx';
import SubjectList from './AdminPanel/SubjectList.jsx';
import ExamList from './AdminPanel/ExamList.jsx';

// import Links from './pages/Links.jsx';
// import StudentSidebar from './pages/StudentSidebar.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

import AddQuestion from './pages/AddQuestion.jsx';
import AddCourse from './pages/AddCourse.jsx';
import AddSubject from './pages/AddSubject.jsx';
import AddTest from './pages/AddTest.jsx';
import UpdateQuestion from './AdminPanel/UpdateQuestion.jsx';

//import About from './components/About/index.js';


function App() {
  return (
    <>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Layout will wrap all child routes */}
                <Route path="/" element={<Layout />}>
                    <Route path="/dashboard" element={<StudentDashboard />} /> 
                    <Route path="/profile" element={<StudentProfile />} /> 
                    <Route path="/result" element={<Result />} />
                </Route>






            {/*<Route path="/addQues" element={<AddQues />} />*/}
         
         

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />   
            
            <Route path="/home/:username" element={<Home />} /> 
            <Route path="/course/:courseId" element={<CourseDetail />} /> 

            {/*<Route path="/links" element={<Links />} /> */}
            {/*<Route path="/carousel" element={<Carousel />} /> */}
            {/*<Route path="/sidebar" element={<StudentSidebar />} /> */}
            {/*<Route path="/profile" element={<StudentProfile />} /> */}
            {/*<Route path="/dashboard" element={<StudentDashboard />} /> */}

            {/* <Route path="/addQuestion/:username" element={<AddQuestion />} />   */}
         <Route path="/" element={<AdminLayout />}>
            <Route path="/addQuestion" element={<AddQuestion />} />   
            <Route path="/addCourse" element={<AddCourse />} />   
            <Route path="/courseList" element={<CourseList />} />   
            <Route path="/addSubject" element={<AddSubject />} />   
            <Route path="/subjectList" element={<SubjectList />} />   
            <Route path="/addTest" element={<AddTest />} />   
            <Route path="/examList" element={<ExamList />} />   
            <Route path="/admin/dashboard" element={<AdminDashboard />} />  
            {/*<Route path="/admin/sidebar" element={<AdminSidebar/>} />*/}
            <Route path="/admin/students" element={<StudentList/>} />
            <Route path="/admin/scoreboard/:course" element={<ScoreBoard/>} />
            <Route path="/admin/questions" element={<Questions/>} />
            <Route path="/updateQuestion/:questionId" element={<UpdateQuestion />} />
         </Route>
            {/*<Route path="/addQuestion/:username" element={<AddQuestion />} />     */}
            <Route path="/neet" element={<NEET />} />
            <Route path="/jee" element={<JEE />} />
            <Route path="/instruction" element={<Instruction />} />
            <Route path="/:course/:testId" element={<Test />} />
            {/*<Route path="/:course/:testId" element={<NewTest />} />*/}
            <Route path="/feedback" element={<Feedback />} />
            {/*<Route path="/result" element={<Result />} />*/}
            
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
         
         </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


