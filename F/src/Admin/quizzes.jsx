import React from "react";
import "./stlyes/table.css";
import axios from "axios";

const Quizzes = ({ data }) => {
  const deleteQuiz = (quizId) => {
    axios
      .delete(`http://localhost:8081/api/quiz/${quizId}`)
      .then((response) => {
        console.log("Quiz deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting quiz:", error);
      });
  };
  return (
    <div className="table-container">
      <div className="button-container"></div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Teacher ID</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.id}</td>
              <td>{quiz.title}</td>
              <td>{quiz.description}</td>
              <td>{quiz.teacher_id}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteQuiz(quiz.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Quizzes;
