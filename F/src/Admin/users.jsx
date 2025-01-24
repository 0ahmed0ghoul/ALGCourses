import React from 'react';
import "./stlyes/table.css";
import axios from 'axios';

const Students = ({ data }) => {
  const deleteUser = (usereId) => {
    axios.delete(`http://localhost:8081/api/user/${usereId}`)
      .then(response => {
        console.log('user deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Is Teacher</th>
            <th>Saved Courses</th>
            <th>Saved Quizzes</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isTeacher ? 'Yes' : 'No'}</td>
              <td>{user.savedCourses}</td>
              <td>{user.savedQuizzes}</td>
              <td>
              <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)} 
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

export default Students;
