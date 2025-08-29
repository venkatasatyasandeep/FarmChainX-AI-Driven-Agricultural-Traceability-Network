import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    return user !== null;
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;