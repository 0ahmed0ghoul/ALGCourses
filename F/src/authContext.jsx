// authContext.jsx
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false); // New state
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      setAuth(false);
      setLoading(false);
      setChecked(true); // Mark as checked when no token is found
    }
  }, []);

  const fetchUserData = (token) => {
    axios
      .get("http://localhost:8081/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setName(res.data.name);
        setId(res.data.id);
        setAuth(true);
        setLoading(false);
        setChecked(true); // Mark as checked when the user data is loaded
      })
      .catch((err) => {
        console.error("Error validating token:", err);
        setAuth(false);
        setLoading(false);
        setChecked(true); // Mark as checked when an error occurs
        localStorage.removeItem("token");
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    axios
      .post("http://localhost:8081/login", values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem("token", res.data.token); 
          setAuth(true); 
          console.log(res.data);
          console.log(res.data.name);
          setName(res.data.name); 
          
          setTimeout(() => navigate("/"), 0);
        } else {
          setError(`Login failed: ${res.data.Error}`);
        }
      })
      .catch((err) => {
        setError("An error occurred during login. Please try again.");
        console.error("Login error:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setName("");
    setId(null); 
    navigate("/"); 
  };

  return (
    <AuthContext.Provider value={{ auth, name, setAuth, setName, id, error,setId,values,setValues,handleSubmit, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
