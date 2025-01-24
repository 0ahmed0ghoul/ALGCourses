import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext"; // Make sure you import AuthContext

function Login() {
  const { setValues, values, error, handleSubmit } = useContext(AuthContext); // Access setAuth and setName from context

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4 text-primary">Login</h2>

        {/* Error Message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control shadow-sm"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control shadow-sm"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="register-link mt-4 text-center">
          <p className="mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary fw-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
