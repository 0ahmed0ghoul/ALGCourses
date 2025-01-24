import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
  const { id, courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isFree: false,
    price: "",
    category: "",
    level: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:8081/course/${courseId}`)
      .then((response) => {
        setCourse(response.data.data[0]); // Access the first course in the array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setLoading(false);
      });
  }, [courseId]);
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title ,
        description: course.description ,
        isFree: course.price === 0, 
        price: course.price || "",
        videoFile: course.video_file_path, 
        category: course.category ,
        level: course.level ,
      });
    }
  }, [course]); // Run this effect whenever `course` changes

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const priceToSend = formData.isFree ? 0 : formData.price;
  
    // Prepare data as a JSON object
    const data = {
      title: formData.title,
      description: formData.description,
      price: priceToSend,
      category: formData.category,
      level: formData.level,
    };
  
    console.log(data); // Check the data before sending
  
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `http://localhost:8081/api/teacher/${id}/course/${courseId}/edit`,
        data, // Send data as JSON
        { headers: { "Content-Type": "application/json" } } // Set the content-type to JSON
      );
      navigate(`/teacher/${id}/dashboard`);
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <br /><br /><br /><br /><br />
      <h2 className="text-center mb-4">Update a Course</h2>
      <h3>(You can only change title, description, price and level)</h3>
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
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Updating..." : "update Course"}
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
