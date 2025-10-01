import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, logoutUser } from "./api";
import "../styles/customer.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const fetchProducts = async () => {
      try {
        const response = await API.get("/all-products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await API.get(`/orders/${storedUser.id}`);
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchOrders();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Add to cart
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((p) => p.id !== productId));

  // Search & Filter
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "newest") filtered.sort((a, b) => b.id - a.id);

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, sortOption, products]);

  // Badge color
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "badge-pending";
      case "shipped":
        return "badge-shipped";
      case "delivered":
        return "badge-delivered";
      default:
        return "";
    }
  };

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === "products" ? "active-tab" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active-tab" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Order History
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          <section className="quick-actions">
            <button onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}>
              Shop Now
            </button>
            <button onClick={() => setShowCartModal(true)}>
              My Cart ({cart.length})
            </button>
          </section>

          <section className="product-controls">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="farmer">Farmer</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
            </select>

            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </section>

          <section className="product-grid">
            {filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>Price: ${product.price}</p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              ))
            )}
          </section>
        </>
      )}

      {/* Order History Tab */}
      {activeTab === "orders" && (
        <section className="order-history">
          {orders.length === 0 ? (
            <p>No past orders.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <h4>Order #{order.id}</h4>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Total: ${order.total}</p>
                <p>
                  Status: <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                </p>
                <div>
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="cart-modal">
          <div className="cart-content">
            <h3>My Cart ({cart.length})</h3>
            <button className="close-btn" onClick={() => setShowCartModal(false)}>
              &times;
            </button>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))
            )}
            {cart.length > 0 && <button className="checkout-btn">Proceed to Checkout</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
