import React, { useContext, useEffect } from "react";
import { AuthContext } from "./authContext";
import CourseDisplay from "./courses/courseDisplay";
import QuizDisplay from "./quizzes/quizzesDisplay";
import { useNavigate } from "react-router-dom";
import "./styles/Dahboard.css";

const Dashboard = () => {
  const { auth, name, checked, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (checked && !auth) {
      navigate("/login");
    }
  }, [auth, checked, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="dashboard-container">


      {auth ? (
        
        <>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <div className="welcome-banner">
            <h1 className="text-center mb-3">
              Welcome to <span className="brand-name">ALGCourses</span>
            </h1>
            <h3 className="text-center text-muted">
              Hello, <strong>{name}</strong>
            </h3>
          </div>
  
          <section className="section my-5">
            <div className="section-header ">
              <h3>Recent Courses</h3>
              <a href="/courses" className="more-link text-primary">
                See All
              </a>
            </div>
          </section>
          <CourseDisplay isDashboard={true} />

  
          <div className="section my-5">
            <div className="section-header ">
              <h3>Recent Quizzes</h3>
              <a href="/quizzes" className="more-link text-primary">
                See All
              </a>
            </div>
          </div>
          <QuizDisplay isDashboard={true} />

        </>
      ) : (
        <div className="auth-reminder text-center">
          <div className="welcome-banner bg-light rounded shadow-lg p-5 mb-4">
            <h1 className="text-primary mb-3">
              Welcome to <span className="brand-name">ALGCourses</span>
            </h1>
            <h3 className="text-secondary">
              Sign Up or Log In to Access More Features
            </h3>
          </div>
          <p className="reminder-text text-muted mb-3">
            Log in to explore our diverse range of courses and engaging quizzes.
          </p>
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;
