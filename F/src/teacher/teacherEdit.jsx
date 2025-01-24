import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const TeacherEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    grade: "",
    bio: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/teacher/${id}`)
      .then((response) => {
        if (response.data) {
          setTeacher(response.data);
        } else {
          setError("Teacher data not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
        setError("Failed to load teacher data.");
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };
  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.first_name || "",
        lastName: teacher.last_name || "",
        dob: formatDate(teacher.dob),
        country: teacher.country || "",
        grade: teacher.grade || "",
        bio: teacher.bio || "",
        profilePicture: teacher.profile_picture || null,
      });
    }
  }, [teacher]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission
    setError("");
    setSuccess("");
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.country ||
      !formData.grade ||
      !formData.bio
    ) {
      setError("Please fill out all required fields.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("grade", formData.grade);
    formDataToSend.append("bio", formData.bio);
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.put(
        `http://localhost:8081/teacher/${id}/edit`,
        formDataToSend
      );
      if (response.data.message === "Teacher updated successfully") {
        setSuccess("Updating successful! Redirecting to Teacher dashboard...");
        navigate(`/teacher/${id}/dashboard`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.Error || "An error occurred. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
  return (
    <div className="my-5" style={{"marginTop":"200px","padding":"15px"}}>
      <div>
      <h2 className="text-center">Teacher Update</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={6}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="dob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="grade">
          <Form.Label>Grade</Form.Label>
          <Form.Control
            type="text"
            name="grade"
            placeholder="Enter grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            rows={4}
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="profilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          Update Teacher
        </Button>
      </Form>
      </div>
    </div>
  );
};

export default TeacherEdit;
