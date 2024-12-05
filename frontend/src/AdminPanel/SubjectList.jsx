import React, { useState, useEffect } from 'react';
import './SubjectList.css';
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import the specific icons from React Icons
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  


const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  

  // Fetch subjects from server when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getTestsAndSubjects'); // Adjust the endpoint if necessary
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);



const handleDelete = async(subjectId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:5000/deleteSubject/${subjectId}`);
      
      // Fetch the updated list of subjects after deletion
      const response = await axios.get('http://localhost:5000/getTestsAndSubjects');
      setSubjects(response.data.subjects);
      
      toast.success("Subject data deleted successfully!" ,{theme: "dark"});
      // alert("Subject data deleted successfully!");
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error("Failed to delete the subject. Please try again.", { theme: "dark" });
      // alert("Failed to delete the subject. Please try again.");
    }
  }
};

  return (
    <div className="subjects">
      <h1>Subjects</h1>
      {/* <div className="add-course-button">
        <button onClick={handleAddCourse}>+ Add Course</button> 
      </div> */}
      <div className="table-container">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Sr No.</th>  
              <th>Subjects</th>            
              <th>Course Name</th>
              
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
               
                <td>{subject.subject}</td>
                <td>
                  {subject.courseName}
                </td>
                <td>                  
                  <button onClick={() => handleDelete(subject._id)} title="Delete">
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

export default SubjectList;