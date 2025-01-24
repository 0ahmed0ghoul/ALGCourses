import React from "react";
import "./stlyes/table.css";
import axios from "axios";

const Teachers = ({ data }) => {
  const deleteTeacher = (teacherId) => {
    axios
      .delete(`http://localhost:8081/api/teacher/${teacherId}`)
      .then((response) => {
        console.log("teacher deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting teacher:", error);
      });
  };
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Country</th>
            <th>Grade</th>
            <th>Bio</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td>{teacher.teacher_id}</td>
              <td>{teacher.userId}</td>
              <td>{teacher.first_name}</td>
              <td>{teacher.last_name}</td>
              <td>{teacher.country}</td>
              <td>{teacher.grade}</td>
              <td>{teacher.bio}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteTeacher(teacher.teacher_id)} // Call the function on button click
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

export default Teachers;
