// pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./api";
import "../styles/auth.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      setUser(user);

      // Role-based dashboard routing
      const dashboardPaths = {
        admin: "/admin-dashboard",
        farmer: "/farmer-dashboard",
        distributor: "/distributor-dashboard",
        retailer: "/retailer-dashboard",
        customer: "/customer-dashboard",
      };

      const path = dashboardPaths[user.role?.toLowerCase()];
      if (!path) throw new Error("Invalid user role");

      navigate(path);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
