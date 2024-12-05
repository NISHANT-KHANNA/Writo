import React,{useState,useEffect} from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  


const AddSubject=()=>{
   
   const [subject,setSubject]= useState("");
   const [courses,setCourses] = useState([]);
   const [courseId,setCourseId] = useState("");
   const navigate = useNavigate();
   
   useEffect(()=>{
      const fetchCourses = async()=>{
      const response = await axios.get("http://localhost:5000/getCoursesName");
      setCourses(response.data);
      };
      fetchCourses();
    },[]);
   
  
  const handleSubmit= async(e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:5000/addSubject", { subject, courseId });
        if (response?.status === 201) {
            
            toast.success(response.data || "Subject added successfully" ,{theme: "dark"});


            // alert(response.data || "Subject added successfully");
            setSubject("");  // Reset subject input field
            setTimeout(() => {
               navigate(`/addTest`);
            }, 1000); 
            // navigate("/addTest");
        } else {
            toast.error("Unexpected response from server", { theme: "dark" });
      
            // alert("Unexpected response from server");
        }
    } catch (err) {
        // Ensure err.response exists to avoid accessing undefined
        toast.error(err.response?.data || "An error occurred while adding the subject", { theme: "dark" });
      
        // alert(err.response?.data || "An error occurred while adding the subject");
    }
};


   return(
   	<>
   	<h2>Add Subject Panel</h2>
   	<form onSubmit={handleSubmit}>
      
        {/* adding question */}
   	  <label>Subject :</label>
   	  <input 
   	  type="text"
      value={subject}
      onChange={(e)=>setSubject(e.target.value)}
      placeholder="add subject"
      required
   	   />

   	   {/* adding options */}
   	  
 
        {/* adding course options */}
   	  <label>Course Options :</label>
   	  <select value={courseId} onChange={(e)=>setCourseId(e.target.value)} required>
      <option value="">Select Course</option>
      {courses.map((course)=>(   	  	
   	  	<option key={course._id} value={course._id}>{course.course}</option>
        ))}
   	  </select>


   
     {/* Submit Button*/}

   	  <button type="submit">Add</button>
      
       <ToastContainer />
    </form>
   	</>
   	);
};


export default AddSubject;