import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css"; // Assuming custom styles are in a separate CSS file

const TeacherSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    grade: "",
    bio: "",
    profilePicture: null,
    password: "", // Add password to the initial state
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
    e.preventDefault();
  
    // Clear previous messages
    setError("");
    setSuccess("");
  
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.password || !formData.country || !formData.grade || !formData.bio) {
      setError("Please fill out all required fields.");
      return;
    }
  
    // Prepare form data for submission
    const data = new FormData();
    data.append("password", formData.password);  // Ensure password is included
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dob", formData.dob);
    data.append("country", formData.country);
    data.append("grade", formData.grade);
    data.append("bio", formData.bio);
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }
  
    try {
      // Retrieve the token from localStorage or cookies
      const token = localStorage.getItem("token");
      console.log("token is :", token);
  
      // Make the request with the token included
      const response = await axios.post("http://localhost:8081/teacher/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      });
  
      if (response.data.Status === "Teacher signup successful") {
        setSuccess("Signup successful! Redirecting to Teacher dashboard...");
  
        // Clear form data after successful signup
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          country: "",
          grade: "",
          bio: "",
          profilePicture: null,
          password: "", // Clear password field too
        });
  
        const teacherId = response.data.teacherId;
        const userId = response.data.userId; // Assuming you send userId in response
  
        // Send PUT request to update the user as a teacher
        try {
          const updateResponse = await axios.put(`http://localhost:8081/update-user/${userId}`);
  
          // Check if update was successful
          if (updateResponse.status === 200) {
            setTimeout(() => {
              navigate(`/teacher/${teacherId}/dashboard`); // Redirect after 2 seconds
            }, 2000);
          } else {
            // Handle case where the update was not successful
            setError("Failed to update user details.");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          setError("An error occurred while updating user details.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.Error || "An error occurred. Please try again."
      );
    }
  };
  

  return (
    <div >
      <div>
      <h2 className="text-center">Teacher Signup</h2>
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

          {/* Last Name */}
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

        {/* Date of Birth */}
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

        {/* Country */}
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

        {/* Grade */}
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

        {/* Bio */}
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

        {/* Password */}
        <Form.Group controlId="Password">
          <Form.Label>Teacher Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter Teacher Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Profile Picture */}
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
          Sign Up
        </Button>
      </Form>
      </div>
    </div>
  );
};

export default TeacherSignup;
