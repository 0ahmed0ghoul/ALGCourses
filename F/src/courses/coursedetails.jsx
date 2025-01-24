import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge, Modal } from "react-bootstrap";
import { AuthContext } from "../authContext"; // Correct import
import axios from "axios";
import "../styles/coursedetails.css";
const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const { name } = useContext(AuthContext); // Get user's name from context
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false); // New state to track if course is saved
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
console.log(name)
  useEffect(() => {
    axios
      .get(`http://localhost:8081/course/${id}`)
      .then((response) => {
        setCourse(response.data.data[0]); // Access the first course in the array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setLoading(false);
      });
  }, [id]);
  console.log(course);
  // Check if course is saved when component mounts
  useEffect(() => {
    if (name) {
      axios
        .get(`http://localhost:8081/checkSaved/${name}/${id}`)
        .then((response) => {
          setIsSaved(response.data.isSaved); // Set the saved status
        })
        .catch((error) => {
          console.error("Error checking course saved status:", error);
        });
    }
  }, [name, id]);
  // Save the course
  const handleSaveCourse = () => {
    console.log(name,id)
    axios
      .post(`http://localhost:8081/savecourse`, { name, id })
      .then((response) => {
        console.log(response);
        setIsSaved(true); // Update state to indicate that the course is saved
      })
      .catch((error) => {
        console.error("Error saving course:", error);
      });
  };

  // Unsave the course
  const handleUnsaveCourse = () => {
    axios
      .post(`http://localhost:8081/unsavecourse`, { name, id })
      .then((response) => {
        console.log(response);
        setIsSaved(false); // Update state to indicate that the course is unsaved
      })
      .catch((error) => {
        console.error("Error unsaving course:", error);
      });
  };

  const handleStartCourse = () => {
    setShowModal(true); // Show the modal when the start button is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }
  console.log(course?.video_file_path);
  return (
    <Container className="my-5">
      {course ? (
        <Card className="shadow-lg">
          <Card.Img
            variant="top"
            src={
              `http://localhost:8081/${course.thumbnail}` ||
              "https://via.placeholder.com/150?text=No+Thumbnail"
            } // Ensure the correct URL
            alt={course?.title}
            style={{ height: "300px", objectFit: "cover" }}
          />
          <Card.Body>
            <Badge bg="info" className="mb-2">
              {course?.category || "General"}
            </Badge>
            <Card.Title>{course?.title}</Card.Title>
            <Card.Text>
              <strong>Instructor: </strong>
              {course?.first_name} {course?.last_name}
            </Card.Text>
            <Card.Text>
              <strong>Description: </strong>
              {course?.description}
            </Card.Text>
            <Card.Text className="text-warning">
              {course?.rating ? `⭐ ${course?.rating}` : "No Rates Yet"}
            </Card.Text>
            <Card.Text className="fw-bold text-primary">
              {course?.price ? `$${course?.price}` : "Free"}
            </Card.Text>
            <Button
              variant={isSaved ? "success" : "primary"}
              className="me-2"
              onClick={isSaved ? handleUnsaveCourse : handleSaveCourse}
            >
              {isSaved ? "Saved" : "Save Course"}
            </Button>
            <br /> <hr />
            <Button variant="primary" onClick={handleStartCourse}>
              Start Course
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>Course not found</div>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Course Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video
            controls
            width="100%"
            src={`http://localhost:8081/uploads/${course?.video_file_path
              ?.split("\\")
              .pop()}`} // Split by backslashes and get the last part
            type="video/mp4"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          >
            Your browser does not support the video tag.
          </video>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseDetails;
