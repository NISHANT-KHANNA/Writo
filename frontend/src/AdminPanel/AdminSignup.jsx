import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from 'axios';
import signup from './signup.png';
import './signup.css';

const AdminSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [secret, setSecret] = useState(''); // Admin secret
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register-admin", {
        username, email, password, cpassword, secret
      });
      alert(response.data);
      if (response.status === 201) {
        navigate("/admin/login");
      }
    } catch (error) {
      alert(error.response ? error.response.data : 'Registration failed');
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
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                placeholder="Choose a username" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                id="email"
                placeholder="Enter your email" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input 
                type="password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)} 
                id="confirm-password" 
                placeholder="Confirm your password" 
                required 
              />
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <p className="login-text">
            Already have an account? <Link to="/admin/login" className="signup-link">Login</Link>
          </p>
        </div>
        <div className="right-section">
          {/* Add your signup illustration image here */}
          <img src={signup} alt="Signup illustration" className="signup-image" />
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
