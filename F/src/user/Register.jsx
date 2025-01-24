import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [formError, setFormError] = useState("");
  const navigate = useNavigate(); // Add useNavigate hook for navigation
  const [isLoading, setIsLoading] = useState(false);  // Define setIsLoading


  // Define handleChange function to update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Reset previous error

    if (values.password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true); // Assuming `setIsLoading` is defined elsewhere or you need to add it

    axios.post('http://localhost:8081/signup', values)
      .then(res => {
        setIsLoading(false);
        if (res.data.Status === 'Success') {
          navigate('/login');
        } else {
          setFormError(res.data.Error);  // Display backend error in form
        }
      })
      .catch(err => {
        setIsLoading(false);
        setFormError(`An error occurred: ${err.message}`);  // Show error in form
        console.log(err);
      });
  };

  return (
    <div className="register-container d-flex align-items-center justify-content-center" >
      <div className="register-card shadow-lg p-4 ">
        <h2 className="text-center mb-4 text-primary">Register</h2>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name Input */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control shadow-sm"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange} // Attach the handleChange function
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control shadow-sm"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange} // Attach the handleChange function
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control shadow-sm"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange} // Attach the handleChange function
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2">
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link mt-4 text-center">
          <p className="mb-0">
            Already have an account? <Link to="/login" className="text-primary fw-bold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
