import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext"; // Correct import
import axios from "axios";
import "./styles/Navbar.css";

const Navbar = () => {
  const { auth, name, id, handleLogout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const navigateToUserDashboard = () => {
    console.log(name)
    console.log("Auth:", auth);
    console.log("ID:", id);
    if (auth && id) {
      navigate(`/user/dashboard/${id}`);
    } else {
      alert("User not authenticated or id not available");
    }
  };

  const checkIfTeacher = async () => {
    try {
      const response = await fetch("http://localhost:8081/check-teacher", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      if (data.isTeacher) {
        navigate(`/teacher/${data.teacherId}/dashboard`);
      } else {
        navigate("/teacher/signup");
      }
    } catch (error) {
      alert("Error checking teacher status:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top custom-navbar">
      <div className="container-fluid">
        <div className="logo d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            <img src="../../public/vite.svg" alt="Logo" className="logo-img" />
            ALGCourses
          </Link>
        </div>

        <div className="search-bar d-flex align-items-center">
          <img
            src="../../public/search.png"
            alt="Search"
            className="search-icon"
          />
          <input type="text" className="search-input" placeholder="Search..." />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link " to="/courses">
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/quizzes">
                Quizzes
              </Link>
            </li>
            {auth && (
              <li className="nav-item">
                <Link className="nav-link" to="#" onClick={checkIfTeacher}>
                  For Teachers
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {loading ? (
              <li className="nav-item">
                <span className="nav-link">Loading...</span>{" "}
                {/* Show loading indicator */}
              </li>
            ) : auth ? (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={navigateToUserDashboard}
                  >
                    {name || "User"}
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
