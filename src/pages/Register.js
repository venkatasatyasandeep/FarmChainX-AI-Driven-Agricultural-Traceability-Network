import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // ✅ Build user object
    const newUser = { name, email, password, role };

    // ✅ Save in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Registration successful! Please login.");
    navigate("/login"); // ✅ go to login
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create Account ✨</h2>
        <p>Join us and select your role</p>

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* Roles */}
          <div className="input-group">
            <label>Select Role</label>
            <div className="roles">
              <label>
                <input 
                  type="radio" 
                  value="admin" 
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                /> Admin
              </label>
              <label>
                <input 
                  type="radio" 
                  value="farmer" 
                  checked={role === "farmer"}
                  onChange={(e) => setRole(e.target.value)}
                /> Farmer
              </label>
              <label>
                <input 
                  type="radio" 
                  value="distributor" 
                  checked={role === "distributor"}
                  onChange={(e) => setRole(e.target.value)}
                /> Distributor
              </label>
              <label>
                <input 
                  type="radio" 
                  value="retailer" 
                  checked={role === "retailer"}
                  onChange={(e) => setRole(e.target.value)}
                /> Retailer
              </label>
              <label>
                <input 
                  type="radio" 
                  value="customer" 
                  checked={role === "customer"}
                  onChange={(e) => setRole(e.target.value)}
                /> Customer
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button className="btn-primary" type="submit">Register</button>
        </form>

        <p className="switch-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
