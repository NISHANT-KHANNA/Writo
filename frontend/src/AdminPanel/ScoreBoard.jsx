import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './ScoreBoard.css';

const ScoreBoard = () => {
  const [scoreBoardData, setScoreBoardData] = useState([]); // array of objects
  const [tests, setTests] = useState([]); // array to hold number of tests
  const { course } = useParams();

  // Fetch the number of tests available for the course
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.post('http://localhost:5000/getTestsAndSubjects', { course });
        setTests(response.data.tests); // Assume server responds with { tests: ['T1', 'T2', 'T3'] }
      } catch (error) {
        console.error('Error fetching available tests:', error.message);
      }
    };

    fetchTests();
  }, [course]);

  // Fetch score data for the scoreboard
  useEffect(() => {
    const fetchScoreBoardData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/admin/scoreboard', { course });
        setScoreBoardData(response.data);
      } catch (error) {
        console.error('Error fetching scorecard data:', error.message);
      }
    };

    fetchScoreBoardData();
  }, [course]);

  return (
    <div className="scoreboard">
      <h1>Score Board for {course}</h1>
      <div className="table-container">
       <table className="scoreboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Course</th>
            {tests.map((test) => (
              <React.Fragment key={test.test}>
                <th>Score {test.test}</th>
                <th>Status {test.test}</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {scoreBoardData.map((student,index) => (
            <tr key={student._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{student.name}</td>
              <td>{student.course}</td>
              {tests.map((test) => {
                const result = student.results.find((res) => res.test === test.test);
                return (
                  <React.Fragment key={test.test}>
                    <td>{result.score || '--'}</td>
                    <td>{result.status || '--'}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default ScoreBoard;
