import React, { useEffect, useRef } from "react";
import {useParams,Link} from "react-router-dom";
import Typed from 'typed.js';
import './Home.css'; 
import logo from './logo.png';
import About from '../../components/About/index.jsx';
import Courses from '../../components/Courses/index.jsx';
import Footer from '../../components/Footer/index.jsx';
import Services from '../../components/Services/index.jsx';
import Carousel from '../../components/Carousel/Carousel.jsx';
 
const Home = () => {
    const el = useRef(null); // Create a reference to store the DOM element for animation
    const coursesRef = useRef(null); // Create a ref for the Courses section

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: ['a win', 'a thrill', 'a breeze'],
            typeSpeed: 150, // Typing speed
            backSpeed: 100, // Erasing speed
            backDelay: 1000, // Delay before starting to erase
            startDelay: 500, // Delay before starting typing
            loop: true, // Loop the animation
            showCursor: true, // Show the blinking cursor
            cursorChar: '|', // Customize the cursor character
        });

        // Cleanup the Typed instance on component unmount
        return () => {
            typed.destroy();
        };
    }, []);
       
       
       const scrollToCourses = () => {
        coursesRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
        <div className="home-container">
            <nav className="navbar">
                <div className="logo-writo">
                    <img src={logo} alt="Logo" className="logo-img" />
                    <span className="company-name">WRITO EDUCATION </span>
                </div>
                <div className="nav-buttons">
                    <button className="nav-btn"><Link to="/login" className="nav-links">Login</Link></button>
                    <button className="nav-btn"><Link to="/signup" className="nav-links">Signup</Link></button>
                </div>
            </nav>

            <div className="main-content">
                <h1 className="main-heading">
                    Exams are <span className="dynamic-text" ref={el} />
                </h1>
                <h1 className="main-heading">with <span>Writo's</span> expertise!</h1>
                <p className="slogan">Tackle Math like a pro with India’s best teachers</p>
                <p className="hashtag">#WritoSeExamsHoJayeAsaan</p>
                <button className="explore-btn" onClick={scrollToCourses}>Explore Courses</button>
            </div>
        </div>
        <About />        
        <div ref={coursesRef}> {/* Attach ref here */}
          <Courses />
        </div>
        <Carousel/>
        <Services />
        <Footer />
        </>
    );
};

export default Home;