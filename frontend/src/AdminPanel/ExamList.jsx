import React, { useState, useEffect } from 'react';
import './ExamList.css';
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import the specific icons from React Icons
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  


const ExamList = () => {
  const [exams, setExams] = useState([]);
  

  // Fetch exams from server when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getTestsAndSubjects'); // Adjust the endpoint if necessary
        setExams(response.data.tests);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);



const handleDelete = async(examId,course,test) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:5000/deleteExam/${examId}/${course}/${test}`);
      
      // Fetch the updated list of exams after deletion
      const response = await axios.get('http://localhost:5000/getTestsAndSubjects');
      setExams(response.data.tests);

      toast.success("Exam data deleted successfully!" ,{theme: "dark"});
      // alert("Exam data deleted successfully!");
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error("Failed to delete the exam. Please try again.", { theme: "dark" });
      // alert("Failed to delete the exam. Please try again.");
    }
  }
};

  return (
    <div className="exams">
      <h1>Exams</h1>
      {/* <div className="add-course-button">
        <button onClick={handleAddCourse}>+ Add Course</button> 
      </div> */}
      <div className="table-container">
        <table className="exams-table">
          <thead>
            <tr>
              <th>Sr No.</th>  
              <th>Test</th>            
              <th>Description</th>
              <th>CourseName</th>
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={exam._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
               
                <td>{exam.test}</td>
                <td>
                  {exam.description}
                </td>
                <td>
                  {exam.courseName}
                </td>
                <td>                  
                  <button onClick={() => handleDelete(exam._id,exam.courseName,exam.test)} title="Delete">
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

export default ExamList;