import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  


const AddQuestion = () => {
   const [question, setQuestion] = useState(null); // Holds the uploaded question image
   const [questionPreview, setQuestionPreview] = useState(null); // Preview for question image
   const [options, setOptions] = useState([null, null, null, null]); // Holds the uploaded option images
   const [optionPreviews, setOptionPreviews] = useState([null, null, null, null]); // Previews for option images
   const [correctAnswer, setCorrectAnswer] = useState(""); // Holds the selected correct answer
   const [course, setCourse] = useState("");
   const [subject, setSubject] = useState("");
   const [level, setLevel] = useState("");
   const [testBox, setTestBox] = useState("");

   const navigate = useNavigate();

   const [courses, setCourses] = useState([]);
   const [testBoxes, setTestBoxes] = useState([]);
   const [subjects, setSubjects] = useState([]);

   // Fetch courses on component mount
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

   // Fetch tests and subjects based on selected course
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
      if (file) {
         const optionArray = [...options];
         const optionPreviewArray = [...optionPreviews];
         optionArray[index] = file;
         optionPreviewArray[index] = URL.createObjectURL(file);
         setOptions(optionArray);
         setOptionPreviews(optionPreviewArray);
      } else {
         const optionArray = [...options];
         const optionPreviewArray = [...optionPreviews];
         optionArray[index] = null;
         optionPreviewArray[index] = null;
         setOptions(optionArray);
         setOptionPreviews(optionPreviewArray);
      }
   };

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();

      // Basic validation
      if (!question) {

         toast.error("Please upload a question image.", { theme: "dark" });
         // alert("Please upload a question image.");
         return;
      }
      for (let i = 0; i < options.length; i++) {
         if (!options[i]) {
            toast.error(`Please upload image for Option ${i + 1}.`, { theme: "dark" });
            // alert(`Please upload image for Option ${i + 1}.`);
            return;
         }
      }
      if (!correctAnswer) {
         
         toast.error("Please select the correct answer.", { theme: "dark" });
         // alert("Please select the correct answer.");
         return;
      }
      if (!course || !subject || !level || !testBox) {
         toast.error("Please fill in all the required fields.", { theme: "dark" });

         // alert("Please fill in all the required fields.");
         return;
      }

      const formData = new FormData();
      formData.append("questionImage", question);
      options.forEach((option, index) => {
         formData.append(`option${index + 1}`, option);
      });
      formData.append("correctAnswer", correctAnswer); // e.g., "Option1"
      formData.append("course", course);
      formData.append("subject", subject);
      formData.append("level", level);
      formData.append("testBox", testBox);

      try {
         const response = await axios.post("http://localhost:5000/addQues", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         toast.success(response.data ,{theme: "dark"});
         // alert(response.data);
         if (response.status === 201) {
            setTimeout(() => {
              navigate(`/addQuestion`);
            }, 1000); 
            // navigate("/addQuestion");

            // Resetting the form for further questions
            setQuestion(null);
            setQuestionPreview(null);
            setOptions([null, null, null, null]);
            setOptionPreviews([null, null, null, null]);
            setCorrectAnswer("");
            setCourse("");
            setSubject("");
            setLevel("");
            setTestBox("");
         }
      } catch (err) {
         console.error("Error adding question:", err);
         toast.error("Error adding question: " + (err.response?.data || err.message), { theme: "dark" });
      
         // alert("Error adding question: " + (err.response?.data || err.message));
      }
   };

   return (
      <>
         <h2>Add Questions Panel</h2>
         <form onSubmit={handleSubmit}>

            {/* Question Image */}
            <label>Question Image:</label>
            <input
               type="file"
               accept="image/*"
               onChange={(e) => handleQuestion(e.target.files[0])}
               required
            />
            {questionPreview && (
               <img src={questionPreview} alt="Uploaded Question" style={{ maxWidth: "150px", marginTop: "10px" }} />
            )}
            <br />
            {/* Options */}
            <label>Options:</label>
            {options.map((option, index) => (
               <div key={index}>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => handleOptions(index, e.target.files[0])}
                     required
                  />
                  {optionPreviews[index] && (
                     <img
                        src={optionPreviews[index]}
                        alt={`Option ${index + 1}`}
                        style={{ maxWidth: "100px", marginTop: "10px" }}
                     />
                  )}
               </div>
            ))}

            {/* Correct Answer */}
            <label>Correct Answer:</label>
            <select
               value={correctAnswer}
               onChange={(e) => setCorrectAnswer(e.target.value)}
               required
            >
               <option value="">Select Correct Answer</option>
               {options.map((option, index) => (
                  <option key={index} value={`Option${index + 1}`}>
                     Option {index + 1}
                  </option>
               ))}
            </select>

            {/* Course Options */}
            <label>Course:</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} required>
               <option value="">Select Course</option>
               {courses.map((courseItem) => (
                  <option key={courseItem._id} value={courseItem.course}>
                     {courseItem.course}
                  </option>
               ))}
            </select>

            {/* Difficulty Level */}
            <label>Difficulty Level:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} required>
               <option value="">Select Difficulty</option>
               <option value="Easy">Easy</option>
               <option value="Medium">Medium</option>
               <option value="Hard">Hard</option>
            </select>

            {/* TestBox Options */}
            <label>TestBox:</label>
            <select
               value={testBox}
               onChange={(e) => setTestBox(e.target.value)}
               required
               disabled={!course}
            >
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
               required
               disabled={!course}
            >
               <option value="">Select Subject</option>
               {subjects.map((subjectItem) => (
                  <option key={subjectItem._id} value={subjectItem.subject}>
                     {subjectItem.subject}
                  </option>
               ))}
            </select>

            {/* Submit Button */}
            <button type="submit">Add</button>

           <ToastContainer />
         </form>
      </>
   );
};

export default AddQuestion;
