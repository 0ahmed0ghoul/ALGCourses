import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/userDashboard.css";
const UserDashboard = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/user/${id}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.Error || "Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8081/getcourses");
        setAllCourses(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.response?.data?.Error || "Failed to fetch courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const parsedSavedCourses = Array.isArray(userData?.savedCourses)
    ? userData.savedCourses
    : JSON.parse(userData?.savedCourses || "[]");
  const savedCourseDetails = allCourses.filter((course) =>
    parsedSavedCourses.includes(String(course.id))
  );
  const handleUnsaveCourse = async (courseId) => {
    try {
      console.log(courseId);

      const response = await axios.post("http://localhost:8081/unsavecourse", {
        name: userData.name, // Use the logged-in user's name
        id: String(courseId), // Pass the course ID to be unsaved
      });

      if (response.status === 200) {
        setAllCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        console.log("Course unsaved successfully");
      }
    } catch (error) {
      console.error("Error unsaving course:", error);
    }
  };
  const handleStartCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true); // Show the modal when the start button is clicked
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-danger text-center mt-5">
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="container mt-5">
      <div className="card shadow-lg rounded-lg">
        <div className="card-header bg-primary text-white text-center py-5">
          <h2 className="display-4">User Dashboard</h2>
          <p className="lead">Manage your courses, quizzes, and profile information</p>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th className="text-secondary">Username:</th>
                    <td className="font-weight-bold">{userData?.name}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">Email:</th>
                    <td className="font-weight-bold">{userData?.email}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">Teacher:</th>
                    <td className="font-weight-bold">
                      {userData?.isTeacher ? "Yes" : "No"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <div className="mt-5">
            <h5 className="text-primary mb-4">Saved Courses</h5>
            <ul className="list-group">
              {savedCourseDetails.length > 0 ? (
                savedCourseDetails.map((course) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center mb-3 p-4 shadow-sm rounded-lg"
                    key={course.id}
                    style={{ backgroundColor: "#f0f8ff" }} // Light blue background for each course item
                  >
                    <div className="d-flex">
                      <img
                        src={`http://localhost:8081/${course.thumbnail.replace(/\\/g, "/")}`} // Thumbnail with forward slashes
                        alt={`${course.title} thumbnail`}
                        style={{
                          width: "90px",
                          height: "70px",
                          objectFit: "cover",
                          marginRight: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <div>
                        <h6 className="font-weight-bold">{course.title}</h6>
                        <p className="text-muted">
                          Teacher: {course.first_name} {course.last_name}
                        </p>
                      </div>
                    </div>
  
                    <div className="d-flex flex-column">
                      <button
                        className="btn btn-outline-danger mb-3"
                        style={{ width: "100px" }}
                        onClick={() => handleUnsaveCourse(course.id)}
                      >
                        Unsave
                      </button>
                      <button
                        className="btn btn-warning"
                        style={{ width: "100px" }}
                        onClick={() => handleStartCourse(course)}
                      >
                        Start
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item list-group-item-warning">
                  No saved courses yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
  
      {/* Modal to view the course video */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Course Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && selectedCourse.video_file_path && (
            <video
              controls
              width="100%"
              src={`http://localhost:8081/uploads/${selectedCourse.video_file_path
                .split("\\")
                .pop()}`}
              type="video/mp4"
              style={{
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
  
};

export default UserDashboard;
