import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './CourseList.css';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import the specific icons from React Icons
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  //const navigate = useNavigate(); // Initialize useNavigate

  // Fetch courses from server when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCoursesName'); // Adjust the endpoint if necessary
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

//   const handleEdit = (questionId) => {
//     // console.log(Edit question with ID: ${questionId});
//     // Navigate to updateQuestion page with the questionId
//     navigate(`/updateCourse/${CourseId}`); // Pass the questionId in the URL
//     // Implement your edit functionality here
//   };

const handleDelete = async(courseId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this course and all associated data?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:5000/deleteCourse/${courseId}`);
      
      // Fetch the updated list of courses after deletion
      const response = await axios.get('http://localhost:5000/getCoursesName');
      setCourses(response.data);
      toast.success("Course and all associated data deleted successfully!" ,{theme: "dark"});
      // alert("Course and all associated data deleted successfully!");
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error("Failed to delete the course. Please try again.", { theme: "dark" });
      // alert("Failed to delete the course. Please try again.");
    }
  }
};


//   const handleAddCourse = () => {
//     navigate('/addCourse'); // Navigate to the Add Question page
//   };

  return (
    <div className="courses">
      <h1>Courses</h1>
      {/* <div className="add-course-button">
        <button onClick={handleAddCourse}>+ Add Course</button> 
      </div> */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Sr No.</th>              
              <th>Course Name</th>
              <th>Subjects </th>
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
               
                <td>{course.course}</td>
                <td>
                  {course.subjects.map((subject) => (
                    <div key={subject.subjectId}>{subject.subjectName}</div>
                  ))}
                </td>
                <td>                  
                  <button onClick={() => handleDelete(course._id)} title="Delete">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CourseList;