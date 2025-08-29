import React, { useState, useEffect } from "react";
import "../styles/DistributorDashboard.css";

const DistributorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");

  // Load orders from localStorage on component mount
  useEffect(() => {
    const loadOrders = () => {
      const retailerOrders = JSON.parse(localStorage.getItem('retailerOrders') || '[]');
      setOrders(retailerOrders);
    };

    loadOrders();
    
    // Set up listener for storage events (to detect new orders from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'retailerOrders') {
        loadOrders();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sample inventory data (would come from your backend in a real app)
  useEffect(() => {
    setInventory([
      { id: 1, product: "Organic Tomatoes", quantity: "120kg", location: "Warehouse A", expiryDate: "2025-09-10" },
      { id: 2, product: "Bell Peppers", quantity: "80kg", location: "Warehouse B", expiryDate: "2025-09-05" },
      { id: 3, product: "Carrots", quantity: "60kg", location: "Warehouse A", expiryDate: "2025-09-15" },
    ]);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    );
    
    setOrders(updatedOrders);
    
    // Update localStorage
    localStorage.setItem('retailerOrders', JSON.stringify(updatedOrders));
  };

  const handleReceiveOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Process each item in the order
      order.items.forEach(item => {
        const productName = item.name;
        const quantity = item.quantity;
        
        // Update inventory
        const existingItem = inventory.find(invItem => invItem.product === productName);
        if (existingItem) {
          const currentQty = parseInt(existingItem.quantity);
          const newQty = currentQty - quantity;
          
          setInventory(prevInventory => 
            prevInventory.map(invItem => 
              invItem.product === productName 
                ? {...invItem, quantity: `${newQty}kg`} 
                : invItem
            )
          );
        }
      });
      
      // Update order status
      updateOrderStatus(orderId, "Fulfilled");
    }
  };
  
  return (
    <div className="distributor-dashboard">
      <h1>Distributor Dashboard</h1>
      <p>Welcome! Manage orders from retailers and track your inventory.</p>

      <div className="tabs">
        <button 
          className={activeTab === "orders" ? "active" : ""} 
          onClick={() => setActiveTab("orders")}
        >
          Retailer Orders ({orders.length})
        </button>
        <button 
          className={activeTab === "inventory" ? "active" : ""} 
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
        <button 
          className={activeTab === "analytics" ? "active" : ""} 
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {activeTab === "orders" && (
        <div className="orders-section">
          <h2>Retailer Orders</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders from retailers yet.</p>
          ) : (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Retailer</th>
                    <th>Items</th>
                    <th>Total Value</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>Retailer Store</td>
                      <td>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>{item.name} x {item.quantity}</li>
                          ))}
                        </ul>
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === "Pending" && (
                          <button 
                            className="btn-action"
                            onClick={() => updateOrderStatus(order.id, "Processing")}
                          >
                            Process
                          </button>
                        )}
                        {order.status === "Processing" && (
                          <button 
                            className="btn-action"
                            onClick={() => updateOrderStatus(order.id, "Shipped")}
                          >
                            Ship
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button 
                            className="btn-action"
                            onClick={() => handleReceiveOrder(order.id)}
                          >
                            Mark Fulfilled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rest of the component remains the same for inventory and analytics */}
      {activeTab === "inventory" && (
        <div className="inventory-section">
          <h2>Current Inventory</h2>
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>{item.location}</td>
                    <td>{item.expiryDate}</td>
                    <td>
                      <span className={`status-badge ${parseInt(item.quantity) > 30 ? "good" : "low"}`}>
                        {parseInt(item.quantity) > 30 ? "Good" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="analytics-section">
          <h2>Distribution Analytics</h2>
          <div className="analytics-cards">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p className="stat-number">{orders.filter(o => o.status === "Pending").length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Inventory Value</h3>
              <p className="stat-number">
                ${inventory.reduce((sum, item) => {
                  // Simple estimation - in real app you'd have actual prices
                  const pricePerKg = item.product.includes("Tomatoes") ? 2.5 : 
                                   item.product.includes("Peppers") ? 3.0 : 1.8;
                  return sum + (parseInt(item.quantity) * pricePerKg);
                }, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;