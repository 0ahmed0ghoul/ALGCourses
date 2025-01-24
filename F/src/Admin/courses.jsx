import React from "react";
import "./stlyes/table.css";
import axios from "axios";

const Modules = ({ data }) => {
  const deleteCourse = (courseId) => {
    axios
      .delete(`http://localhost:8081/api/course/${courseId}`)
      .then((response) => {
        console.log("Course deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Level</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.price}</td>
              <td>{course.category}</td>
              <td>{course.level}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteCourse(course.id)} 
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

export default Modules;
