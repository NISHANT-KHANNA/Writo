import React from 'react';
import './index.css';
import { IoLocationOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { FaInstagramSquare, FaFacebook, FaLinkedin } from "react-icons/fa";
import watermark from './watermark.png';

const Footer = () => {
  return (
    <footer className="footer">
      
      <div className="footer-content">
      {/* <img src="watermark.png" className='watermark'> */}
        <div className="footer-column ">
        <img src="watermark.png" className='watermark'></img>
          <h3>Writo Education</h3>
          <p>We're passionate about empowering JEE/NEET aspirants to reach their full potential. </p>
        </div>
        <div className="footer-column">
          <h3>Quick links</h3>
          <ul>
              <li>Why choose us</li>
              <li>Contact us</li>
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
              <li>FAQs and Help</li>
          </ul>
          
        </div>
        <div className="footer-column">
          <h3>Business Hours</h3>
          <ul>
              <li>Mon - Fri</li>
              <li>9:00 a.m. to 7:00 p.m.</li>
              <li>Saturday</li>
              <li>9:00 a.m. to 6:00 p.m.</li>
              <li>Sunday also available</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Info</h3>
          <ul>
              <li><IoLocationOutline /> Rewa, India</li>
              <li><IoCallOutline /> +91 80594 58609</li>
              <li><CiMail /> support@writo.tech</li>
              <li className='icons'>
                <FaInstagramSquare />
                <FaFacebook />
                <FaLinkedin />
              </li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; Writo Education. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
