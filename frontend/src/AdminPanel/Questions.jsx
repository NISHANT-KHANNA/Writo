import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import the specific icons from React Icons
import './Questions.css'; // Import the CSS file for styling
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch questions from server when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/questions'); // Adjust the endpoint if necessary
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching question data:', error); 
      }
    };

    fetchQuestions();
  }, []);

  const handleEdit = (questionId) => {
    // console.log(`Edit question with ID: ${questionId}`);
    // Navigate to updateQuestion page with the questionId
    navigate(`/updateQuestion/${questionId}`); // Pass the questionId in the URL
    // Implement your edit functionality here
  };

  const handleDelete = async(questionId) => {
    // console.log(`Delete question with ID: ${questionId}`);

    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if(confirmDelete){
      try{
        await axios.delete(`http://localhost:5000/deleteQuestion/${questionId}`);
      // Fetch the updated list of questions
      const response = await axios.get('http://localhost:5000/admin/questions');
      setQuestions(response.data);
      // Show a success message (You can customize this as per your requirements)
      toast.success("Question deleted successfully!" ,{theme: "dark"});
      // alert("Question deleted successfully!");
      
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error("Failed to delete the question. Please try again.", { theme: "dark" });
      // alert("Failed to delete the question. Please try again.");
    }
  }
};

  const handleAddQuestion = () => {
    navigate('/addQuestion'); // Navigate to the Add Question page
  };

  return (
    <div className="questions">
      <h1>Questions</h1>
      <div className="add-question-button">
        <button onClick={handleAddQuestion}>+ Add Question</button> {/* Add Question button */}
      </div>
      <div className="table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Question</th>
              <th>Course</th>
              <th>Test Box</th>
              <th>Level</th>
              <th>Actions</th> {/* New Actions column */}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
                <td>
                    <img
                        src={`http://localhost:5000/uploads/${question.question}`}
                        alt="Question"
                        className="question-image"
                    />
                </td>
                <td>{question.course}</td>
                <td>{question.testBox.toUpperCase()}</td>
                <td>{question.level}</td>
                <td>
                  <button onClick={() => handleEdit(question._id)} title="Edit">
                    <FaPencilAlt /> {/* React Icons pencil icon */}
                  </button>
                  <button onClick={() => handleDelete(question._id)} title="Delete">
                    <FaTrashAlt /> {/* React Icons trash icon */}
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

export default Questions;
