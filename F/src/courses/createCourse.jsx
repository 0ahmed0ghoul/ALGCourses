import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateCourseForm = () => {
  const { id } = useParams(); // Extract teacher ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isFree: true,
    price: "",
    videoFile: null,
    category: "", // New field for category
    level: "", // New field for course level
    duration: "", // New field for course duration
  });

  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // To handle error messages

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.videoFile) {
      setError("Please select a video file.");
      return;
    }
  
    // If the course is free, set the price to 0
    const priceToSend = formData.isFree ? 0 : formData.price;
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", priceToSend); // Send price as 0 if free
    data.append("videoFile", formData.videoFile);
    data.append("category", formData.category);
    data.append("level", formData.level);
  
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `http://localhost:8081/api/teacher/${id}/create-course`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate(`/teacher/${id}/dashboard`);
    } catch (error) {
      console.error("Error creating course:", error);
      setError("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Database</option>
            <option value="Graphic Design">Mobile Network</option>
            <option value="Marketing">English</option>
            <option value="E-business">E-business</option>

          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="level" className="form-label">
            Level
          </label>
          <select
            id="level"
            name="level"
            className="form-select"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a level
            </option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            className="form-check-input"
            checked={formData.isFree}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isFree">
            Is this course free?
          </label>
        </div>

        {!formData.isFree && (
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="videoFile" className="form-label">
            Upload Video
          </label>
          <input
            type="file"
            id="videoFile"
            name="videoFile"
            className="form-control"
            accept="video/*"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
