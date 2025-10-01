// pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // default role
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role, // backend will enforce non-admin
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        userData
      );

      alert("Registration Success: " + response.data.message);
      console.log("Registered User:", response.data.user);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert("Registration Failed: " + error.response.data.message);
      } else {
        alert("Registration Failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create Account ✨</h2>
        <p>Join us and select your role</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Select Role</label>
            <div className="roles">
              {["farmer", "distributor", "retailer", "customer"].map(
                (roleOption) => (
                  <label key={roleOption}>
                    <input
                      type="radio"
                      name="role"
                      value={roleOption}
                      checked={formData.role === roleOption}
                      onChange={handleChange}
                      required
                    />{" "}
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </label>
                )
              )}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
