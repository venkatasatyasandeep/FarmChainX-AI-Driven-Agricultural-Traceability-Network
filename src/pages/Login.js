import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ... existing code ...

 const handleLogin = (e) => {
   e.preventDefault();
   const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && savedUser.email === email && savedUser.password === password) {
    // Determine the appropriate dashboard based on role
    let dashboardPath = "/";
    switch (savedUser.role) {
      case "farmer":
        dashboardPath = "/farmer-dashboard";
        break;
      case "admin":
        dashboardPath = "/admin-dashboard";
        break;
      case "distributor":
        dashboardPath = "/distributor-dashboard";
        break;
      case "retailer":
        dashboardPath = "/retailer-dashboard";
        break;
      case "customer":
        dashboardPath = "/customer-dashboard";
        break;
      default:
        alert("Invalid role!");
    }
    
    navigate(dashboardPath);
  } else {
    alert("Invalid credentials!");
  }
 };

// ... rest of the code ...
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Welcome Back 👋</h2>
        <p>Please login to continue</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="btn-primary" type="submit">Login</button>
        </form>
        <p className="switch-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;