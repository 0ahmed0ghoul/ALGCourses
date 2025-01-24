import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/courseDisplay.css";
import { AuthContext } from "../authContext";

const CourseDisplay = ({ isDashboard }) => {
  const { auth } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/getcourses")
      .then((response) => {
        setCourses(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const checkUser = (course) => {
    if (auth) {
      navigate(`/course/${course.id}`);
    } else {
      alert("You need to log in first to view course details.");
    }
  };

  const reversedCourses = courses.slice().reverse().slice(0, 2);

  return (
    <div style={{"display":"flex","justifyContent":"center" }} className="bg-light rounded shadow-lg p-5 mb-4">
      <Row>
        {reversedCourses.map((course) => (
          <Col key={course.id} xs={12} md={6} className="mb-4" style={{ width: '350px' }}>
            <Card className="h-100 shadow-sm course-card" style={{ width: '100%', height: '300px' }}>
              <Card.Img
                variant="top"
                src={
                  course.thumbnail
                    ? `http://localhost:8081/${course.thumbnail}`
                    : "https://via.placeholder.com/150?text=No+Thumbnail"
                }
                alt={course.title ? `Thumbnail of ${course.title}` : "Course Thumbnail"}
                className="course-image"
                style={{
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <Card.Body>
                <Badge bg="info" className="mb-2">
                  {course.category || "General"}
                </Badge>
                <Card.Title className="text-truncate mb-2" title={course.title || "Untitled Course"}>
                  {course.title || "Untitled Course"}
                </Card.Title>
                <Card.Text className="mb-1 text-muted small">
                  Instructor:{" "}
                  <strong>
                    {course.first_name} {course.last_name}
                  </strong>
                </Card.Text>
                <Card.Text className="text-warning small mb-1">
                  {course.rating ? `⭐ ${course.rating}` : "No ratings yet"}
                </Card.Text>
                <Card.Text className="fw-bold text-primary small mb-3">
                  {course.price ? `$${course.price}` : "Free"}
                </Card.Text>
                <Card.Text className="text-muted small mb-3">
                  Level: <strong>{course.level || "Not specified"}</strong>
                </Card.Text>
                <Button variant="primary" onClick={() => checkUser(course)} style={{textAlign:"center",width:"100%"}}>
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
  
};

export default CourseDisplay;
