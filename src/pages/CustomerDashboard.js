// src/pages/CustomerDashboard.js
import React from "react";

const CustomerDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome! Here you can browse products, add to cart, and place orders.</p>

      <div style={{ marginTop: "20px" }}>
        <button>Shop Now</button>
        <button style={{ marginLeft: "10px" }}>My Cart</button>
        <button style={{ marginLeft: "10px" }}>Order History</button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
