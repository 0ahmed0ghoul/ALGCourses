import React, { useState, useEffect } from "react";
import "./stlyes/admin.css";
import Teachers from "./teachers";
import Students from "./users.jsx";
import Modules from "./courses.jsx";
import Quizzes from "./quizzes.jsx";
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("teachers");
  
  const [data, setData] = useState({
    users: [],
    teachers: [],
    courses: [],
    quizzes: []
  });

  useEffect(() => {
    // Fetch data from the server using axios
    axios.get('http://localhost:8081/admin')
      .then(response => {
        setData(response.data); // Axios automatically parses the JSON response
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "teachers":
        return <Teachers data={data.teachers} />;
      case "users":
        return <Students data={data.users} />;
      case "courses":
        return <Modules data={data.courses} />;
      case "quizzes":
        return <Quizzes data={data.quizzes} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>
      <div className="tabs">
        <button
          onClick={() => setActiveTab("teachers")}
          className={activeTab === "teachers" ? "active" : ""}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" ? "active" : ""}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={activeTab === "courses" ? "active" : ""}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={activeTab === "quizzes" ? "active" : ""}
        >
          Quizzes
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Admin;
