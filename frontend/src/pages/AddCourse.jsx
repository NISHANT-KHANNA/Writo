import React,{useState} from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  


const AddCourse=()=>{
   const [course,setCourse]= useState("");
   const navigate = useNavigate();
     
   const handleSubmit= async(e)=>{
      e.preventDefault();

      try{
         const response= await axios.post("http://localhost:5000/addCourse",{course});
         toast.success(response.data ,{theme: "dark"});

         // alert(response.data);
           if(response.status === 201){
            setTimeout(() => {
              navigate(`/addSubject`);
            }, 1000); 
            // navigate("/addSubject");
         
        // reseting the boxes to add further questions
         
         setCourse("");
         
      }}
      catch(err){
         toast.error(err.response.data, { theme: "dark" });
      
      	// alert(err.response.data);
      }


   };
   

   return(
   	<>
   	<h2>Add Course Panel</h2>
   	<form onSubmit={handleSubmit}>
      
        {/* adding question */}
   	  <label>Course :</label>
   	  <input 
   	  type="text"
      value={course}
      onChange={(e)=>setCourse(e.target.value)}
      placeholder="add course"
      required
   	   />

     {/* Submit Button*/}

   	  <button type="submit">Add</button>
        <ToastContainer />
    </form>
   	</>
   	);
};


export default AddCourse;