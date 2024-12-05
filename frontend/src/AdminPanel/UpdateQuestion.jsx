import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  

const UpdateQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  
  const [oldQuestion, setOldQuestion] = useState(null); // old question preview image so it does not change 
  const [question, setQuestion] = useState(null); // Uploaded question image
  const [questionPreview, setQuestionPreview] = useState(null); // Preview for question image
  const [oldOptions, setOldOptions] = useState([null, null, null, null]); // Uploaded option preview image so it does not change 
  const [options, setOptions] = useState([null, null, null, null]); // Uploaded option images
  const [optionPreviews, setOptionPreviews] = useState([null, null, null, null]); // Previews for option images
  const [correctAnswer, setCorrectAnswer] = useState(""); // Selected correct answer
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [testBox, setTestBox] = useState("");

  const [courses, setCourses] = useState([]);
  const [testBoxes, setTestBoxes] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getCoursesName");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        alert("Error fetching courses.");
      }
    };
    fetchCourses();
  }, []);

  // Fetch test boxes and subjects based on selected course
  useEffect(() => {
    if (course) {
      const fetchTestsAndSubjects = async () => {
        try {
          const response = await axios.post("http://localhost:5000/getTestsAndSubjects", { course });
          setSubjects(response.data.subjects);
          setTestBoxes(response.data.tests);
        } catch (err) {
          console.error("Error fetching tests and subjects:", err);
          alert("Error fetching tests and subjects.");
        }
      };
      fetchTestsAndSubjects();
    } else {
      setSubjects([]);
      setTestBoxes([]);
    }
  }, [course]);

  // Fetch question details
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getQuestion/${questionId}`);
        if (response.data) {
          setQuestion(response.data.question || null);
          setOldQuestion(response.data.question || null);
          setOptions(response.data.options || []);
          setOldOptions(response.data.options || []);
          setCorrectAnswer(response.data.correctAnswer || "");
          setCourse(response.data.course || "");
          setSubject(response.data.subject);
          setLevel(response.data.level || "");
          setTestBox(response.data.testBox || "");
        } 
      } 

      catch (error) {
        console.error("Error fetching question details:", error);
        alert("Failed to fetch question details.");
        navigate("/admin/questions");
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId, navigate]);

  // Handle question image upload and preview
  const handleQuestion = (file) => {
    if (file) {
      setQuestion(file);
      setQuestionPreview(URL.createObjectURL(file));
    } else {
      setQuestion(null);
      setQuestionPreview(null);
    }
  };

  // Handle option image upload and preview
  const handleOptions = (index, file) => {
    const optionArray = [...options];
    const optionPreviewArray = [...optionPreviews];
    optionArray[index] = file;
    optionPreviewArray[index] = file ? URL.createObjectURL(file) : null;
    setOptions(optionArray);
    setOptionPreviews(optionPreviewArray);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("questionImage", question);
    options.forEach((option, index) => {
      formData.append(`option${index + 1}`, option);
    });
    formData.append("correctAnswer", correctAnswer);
    formData.append("course", course);
    formData.append("subject", subject);
    formData.append("level", level);
    formData.append("testBox", testBox);

    try {
      const response = await axios.put(`http://localhost:5000/updateQuestion/${questionId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message ,{theme: "dark"});
      // alert(response.data.message);
      // Navigate after the delay
      setTimeout(() => {
        navigate(`/admin/questions`);
      }, 1000); // Wait for the toast to be displayed before navigating
      // navigate("/admin/questions");
    }
     catch (err) {
      console.error("Error updating question:", err.response?.data || err.message);
      toast.error(err.response?.data.message || "Failed to update the question. Please try again.", { theme: "dark" });
      // alert(err.response?.data.message || "Failed to update the question. Please try again.");
    }
  };

  return (
    <>
      <h2>Update Question</h2>
      <form onSubmit={handleSubmit}>

        {/* Original Question */}
        <label>Original Question Image:</label>
        {question ? (
          <img
            src={`http://localhost:5000/uploads/${oldQuestion}`}
            alt="Original Question"
            className="question-image"
          />
        ) : (
          <p>No original question found.</p>
        )}

        {/* Upload New Question */}
        <br /><br />
        <label>Update Question:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleQuestion(e.target.files[0])}
          
        />
        {questionPreview && <img src={questionPreview} alt="Uploaded Question" style={{ maxWidth: "200px", marginTop: "10px" }} />}

        {/* Original Options */}
        <label>Original Options:</label>
        {options.map((option, index) => (
          <div key={index}>
            {option && (
              <img
                src={`http://localhost:5000/uploads/${oldOptions[index]}`}
                alt={`Original Option ${index + 1}`}
                className="question-image"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleOptions(index, e.target.files[0])}
              
            />
            {optionPreviews[index] && (
              <img
                src={optionPreviews[index]}
                alt={`Option ${index + 1}`}
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
        ))}

        {/* Correct Answer */}
        <label>Correct Answer:</label>
        <select
          id="correctAnswer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          
        >
          <option value="">Select Correct Answer</option>
          {options.map((option , index) => (
            <option key={index} value={`Option${index + 1}`}>
              Option {index + 1}
            </option>
          ))}
        </select>

        {/* Course */}
        <label>Course:</label>
        <select id="course" value={course} onChange={(e) => setCourse(e.target.value)} >
          <option value="">Select Course</option>
          {courses.map((courseItem) => (
            <option key={courseItem._id} value={courseItem.course}>
              {courseItem.course}
            </option>
          ))}
        </select>

        {/* Level */}
        <label>Difficulty Level:</label>
        <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Test Box */}
        <label>TestBox:</label>
        <select id="testBox" value={testBox} onChange={(e) => setTestBox(e.target.value)} >
          <option value="">Select TestBox</option>
          {testBoxes.map((testBoxItem) => (
            <option key={testBoxItem._id} value={testBoxItem.test}>
              {testBoxItem.test}
            </option>
          ))}
        </select>

        {/* Subject Options */}
            <label>Subject:</label>
            <select
               value={subject}
               onChange={(e) => setSubject(e.target.value)}
            >
               <option value="">Select Subject</option>
               {subjects.map((subjectItem) => (
                  <option key={subjectItem._id} value={subjectItem.subject}>
                     {subjectItem.subject}
                  </option>
               ))}
            </select>

        {/* Submit Button */}
        <button type="submit">Update</button>
         <ToastContainer />
      </form>
    </>
  );
};

export default UpdateQuestion;
