import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AvatarGenerator } from 'random-avatar-generator';
import axios from 'axios';
import './Login.css';
import login from './login.png';
import writo from './writo.png'; 
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';            // for notification css


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Import useNavigate from react-router-dom
  const generator = new AvatarGenerator();

  const handleLogin = async(event) => {
    event.preventDefault(); // Prevent the default form submission

    // Here, you would typically handle login logic, e.g., sending the email and password to an API
       try{
         const response = await axios.post("http://localhost:5000/login",{
           email,password
         });
         console.log(response);
         
         toast.success(response.data.message ,{theme: "dark"});
         if (response.status === 200) {

            const newAvatar = generator.generateRandomAvatar();
            const userData={
              userId :response.data.userId,
              username:response.data.username,
              course:response.data.course,
              avatar:newAvatar,
            };
            localStorage.setItem("user",JSON.stringify(userData));
            // Navigate after the delay
           setTimeout(() => {
              navigate(`/dashboard`);
            }, 1000); // Wait for the toast to be displayed before navigating
            // navigate(`/dashboard`); // Navigate to the corresponding course page

      }
    }
    catch(error){
      toast.error(error.response ? error.response.data.message : 'Login failed', { theme: "dark" });
      // alert(error.response ? error.response.data.message : 'Login failed');
    }
    // For example, on successful login, navigate to the homepage
   
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <img src={writo} alt="Writo" className="writo-img" />
          <h1>Writo Education</h1>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="signup-text">
            Don't have an account? <Link to="/Signup" className="signup-link">Sign Up</Link>
          </p>
           <p className="signup-text">
            Are you an Admin? <Link to="/admin/login" className="signup-link">Login</Link>
          </p>
        </div>
        <div className="right-section">
          <img src={login} alt="Login illustration" className="login-image" />
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

export default Login;