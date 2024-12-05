import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Signup.css';
import signup from './signup.png';
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css'; 

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [course, setCourse] = useState('');
  const [courses,setCourses] = useState([]); // fetches all the courses available 
  const navigate = useNavigate();
  

  useEffect(()=>{
      const fetchCourses = async()=>{
      const response = await axios.get("http://localhost:5000/getCoursesName");
      setCourses(response.data);
      };
      fetchCourses();
    },[]);
   

  const handleRegister=async(e)=>{
        e.preventDefault();
        try{
           const response = await axios.post("http://localhost:5000/register",{
                            username,email,password,cpassword,course,
           });
           toast.success(response.data ,{theme: "dark"});

           // alert(response.data);
           if(response.status === 201){
            // localStorage.setItem("course", course);  
            setTimeout(() => {
              navigate(`/login`);
            }, 1000);
            // navigate("/login");
           }
        }
        catch(error){
          toast.error(error.response ? error.response.data : 'Registration failed', { theme: "dark" });
           // alert(error.response ? error.response.data : 'Registration failed');
        }
   };


  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="left-section">
          <h1>Sign Up</h1>

          <form className="signup-form" onSubmit={handleRegister}>
          
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" 
                     value = {username}
                     onChange ={(e)=> setUsername(e.target.value)}
                     id="username"
                     placeholder="Choose a username" 
                     required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email"
                     value = {email}
                     onChange ={(e)=> setEmail(e.target.value)} 
                     id="email"
                     placeholder="Enter your email" 
                     required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" 
                     value = {password}
                     onChange ={(e)=> setPassword(e.target.value)}
                     id="password" 
                     placeholder="Enter your password" 
                     required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password"
                     value = {cpassword}
                     onChange ={(e)=> setCpassword(e.target.value)} 
                     id="confirm-password" 
                     placeholder="Confirm your password" 
                     required />
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <select 
                     value={course}
                     onChange={(e) => setCourse(e.target.value)}
                     id="course"
                     required>
                    <option value="">Select Course</option>
                    {courses.map((course)=>(        
                    <option key={course._id} value={course.course}>{course.course}</option>
                    ))}
                {/*<option value="" disabled>Select your course</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="12th">12th</option>
                <option value="10th">10th</option>*/}
              </select>
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <p className="login-text">
            Already have an account?<Link to="/Login" className="signup-link">Login</Link>
          </p>
        </div>
        <div className="right-section">
          <img src={signup} alt="Signup illustration" className="signup-image" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;