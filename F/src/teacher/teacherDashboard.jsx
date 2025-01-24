import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/teacherDahboard.css";

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [quizzesCreated, setQuizzesCreated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/teacher/${id}`
        );
        setTeacherData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError(err.response?.data?.Error || "Failed to fetch teacher data.");
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/teacher/${id}/courses`
        );
        setCourses(response.data.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.response?.data?.Error || "Failed to fetch courses.");
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/teacher/${id}/quizzes`
        );
        setQuizzesCreated(response.data.data || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.response?.data?.Error || "Failed to fetch quizzes.");
      }
    };

    fetchTeacherData();
    fetchCourses();
    fetchQuizzes();
  }, [id]);

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

  let { first_name, last_name, dob, country, grade, bio, profile_picture } =
    teacherData;
  dob = new Date(dob).toISOString().split("T")[0];

  const tableData = [
    { label: "First Name", value: first_name },
    { label: "Last Name", value: last_name },
    { label: "Date of Birth", value: dob },
    { label: "Country", value: country },
    { label: "Grade", value: grade },
    { label: "Bio", value: bio },
  ];

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/teacher/${id}/course/${courseId}`
      );
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course.");
    }
  };

  const handleDeleteQuizzes = async (quizid) => {
    try {
      console.log("Deleting quiz with id:", quizid);
      await axios.delete(
        `http://localhost:8081/api/teacher/${id}/quiz/${quizid}`
      );
      setQuizzesCreated(quizzesCreated.filter((quiz) => quiz.id !== quizid));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz.");
    }
  };

  return (
    <div className="container ">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>Teacher Dashboard</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src={`http://localhost:8081/uploads/${profile_picture}`}
                alt="Profile"
                style={{ width: "150px" ,height: "150px" ,borderRadius:"50%",border:"2px solid grey" }}
              />
            </div>
            <div className="col-md-8">
              <table className="table table-borderless">
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <th>{row.label}:</th>
                      <td>{row.value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="teacher_job text-center">
            <button
              className="btn btn-success mx-2"
              onClick={() => navigate(`/teacher/${id}/create-course`)}
            >
              Create a Course
            </button>
            <button
              className="btn btn-info mx-2"
              onClick={() => navigate(`/teacher/${id}/create-quizzes`)}
            >
              Create a Quiz
            </button>
            <button
              className="btn btn-warning mx-2"
              onClick={() => navigate(`/teacher/${id}/edit`)}
            >
              Update Information
            </button>
          </div>
          <hr />

          <div className="mt-4">
            <h5 className="mb-3">Created Courses</h5>
            <div className="row">
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                    <div
                      className="card shadow-sm h-100"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #007bff",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title text-primary text-truncate">
                          {course.title || "Untitled Course"}
                        </h5>
                        <p className="card-text text-secondary">
                          {course.description || "No description available."}
                        </p>
                      </div>
                      <div
                        className="card-footer d-flex justify-content-between"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderTop: "1px solid #ddd",
                        }}
                      >
                        <button
                          className="btn btn-info "
                          style={{
                            textAlign: "center",width:"fit-content",height:"60px",fontSize:"20px",padding:"5px",margin:"5px"
                          }}
                          onClick={() =>navigate(`/teacher/${id}/course/${course.id}/edit`)}
                          title="Update Course"
                        >
                           Update
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="btn btn-danger"
                          style={{
                            textAlign: "center",width:"fit-content",height:"60px",fontSize:"20px",padding:"5px",margin:"5px"
                          }}
                          title="Delete Course"
                        >
                           Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-info" role="alert">
                    No courses created yet.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h5 className="mb-3">Created Quizzes</h5>
            <div className="row">
              {quizzesCreated && quizzesCreated.length > 0 ? (
                quizzesCreated.map((quiz, index) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                    <div
                      className="card shadow-sm h-100"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #007bff",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title text-primary text-truncate">
                          {quiz.title || "Untitled Quiz"}
                        </h5>
                        <p className="card-text text-secondary">
                          {quiz.description || "No description available."}
                        </p>
                      </div>
                      <div
                        className="card-footer d-flex justify-content-between"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderTop: "1px solid #ddd",
                          padding: "15px",
                        }}
                      >
                        <button
                          className="btn btn-danger "
                          style={{
                            margin: "5px",textAlign:"center",fontSize:"20px"
                          }}
                          onClick={() => handleDeleteQuizzes(quiz.id)}
                          title="Delete Quiz"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-info" role="alert">
                    No quizzes created yet.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
