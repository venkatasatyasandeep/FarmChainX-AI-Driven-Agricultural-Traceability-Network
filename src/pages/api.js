// src/pages/api.js
import axios from "axios";

// Create a reusable Axios instance
export const API = axios.create({
  baseURL: "http://localhost:8080/api/users",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically if available
API.interceptors.request.use(
  (config) => {
    // Read token from stored user object
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/login", { email, password });
    const { user, token } = response.data;

    if (!user || !token) throw new Error("Invalid login response");

    // Save token inside user object for consistency
    const userWithToken = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));

    return userWithToken;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data.user || response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("user"); // removes token as well
};
