import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentList.css'; // Import the CSS file

const StudentList = () => {
  const [students, setStudents] = useState([]);

  // Fetch students from server when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    
    fetchStudents();
  }, []);

  return (
    <div className="student-list">
      <h1>Enrolled Students</h1>
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            { 
              students.map((student, index) => (
              <tr key={student._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;