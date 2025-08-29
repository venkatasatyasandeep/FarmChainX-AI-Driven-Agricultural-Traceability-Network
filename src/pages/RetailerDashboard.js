import React, { useState, useEffect } from "react";
import "../styles/RetailerDashboard.css";

const RetailerDashboard = () => {
  const availableProducts = [
    { id: 1, name: "Organic Tomatoes", price: "$2.50/kg", supplier: "Green Fields Farm" },
    { id: 2, name: "Bell Peppers", price: "$3.00/kg", supplier: "Sunshine Acres" },
    { id: 3, name: "Carrots", price: "$1.80/kg", supplier: "Riverbend Farm" },
    { id: 4, name: "Banana", price: "$2.80/kg", supplier: "Riverbend Farm" },
  ];

  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // products | cart | history
  const [addedProductId, setAddedProductId] = useState(null); // <-- NEW

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("retailerOrders") || "[]");
    setOrderHistory(savedOrders);
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // 🔥 Change button text temporarily
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: Date.now(),
      items: [...cart],
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      total: cart.reduce(
        (sum, item) =>
          sum + parseFloat(item.price.replace("$", "")) * item.quantity,
        0
      ),
    };

    const existingOrders = JSON.parse(localStorage.getItem("retailerOrders") || "[]");
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("retailerOrders", JSON.stringify(updatedOrders));

    setOrderHistory(updatedOrders);
    setCart([]);
    alert("Order placed successfully!");
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <div className="retailer-dashboard">
      <h1>Retailer Dashboard</h1>
      <p>Welcome! Browse products and place orders with distributors.</p>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Browse Products
        </button>
        <button
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => setActiveTab("cart")}
        >
          Shopping Cart ({cart.length})
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="products-grid">
          <h2>Available Products</h2>
          <div className="products-list">
            {availableProducts.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <p>Supplier: {product.supplier}</p>
                <button
                  onClick={() => addToCart(product)}
                  disabled={addedProductId === product.id} // disable briefly
                >
                  {addedProductId === product.id ? "Added!" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === "cart" && (
        <div className="cart-section">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      $
                      {(
                        parseFloat(item.price.replace("$", "")) * item.quantity
                      ).toFixed(2)}
                    </span>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                Total: $
                {cart
                  .reduce(
                    (sum, item) =>
                      sum +
                      parseFloat(item.price.replace("$", "")) * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </div>
              <button className="place-order-btn" onClick={placeOrder}>
                Place Order
              </button>
            </>
          )}
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === "history" && (
        <div className="order-history">
          <h2>Order History</h2>
          {orderHistory.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orderHistory.map((order) => (
              <div key={order.id} className="order-card">
                <p>
                  <strong>Date:</strong> {order.date}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;
