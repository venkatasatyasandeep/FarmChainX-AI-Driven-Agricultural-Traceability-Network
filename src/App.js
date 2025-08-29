import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductsPage from "./pages/farmer-dashboard/ProductsPage";
import AddProductPage from "./pages/farmer-dashboard/AddProductPage";
import DistributorDashboard from "./pages/DistributorDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetail from "./pages/ProductDetail";
import "./styles/App.css";
import "./styles/ProductDetail.css";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  // Function to add a new product
  const addProduct = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Function to delete a product
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route → Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
         
          {/* Public Routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Protected Routes */}
        <Route
            path="/farmer-dashboard"
            element={
              <PrivateRoute user={user}>
                <ProductsPage 
                  products={products} 
                  onDeleteProduct={deleteProduct}
                />
              </PrivateRoute>
            }
        />
        <Route
            path="/add-product"
            element={
              <PrivateRoute user={user}>
                <AddProductPage addProduct={addProduct} />
              </PrivateRoute>
            }
        />
        <Route
          path="/distributor-dashboard"
          element={
            <PrivateRoute user={user}>
              <DistributorDashboard />
            </PrivateRoute>
          }
        />
        {/* Retailer Dashboard */}
         <Route
           path="/retailer-dashboard"
           element={
             <PrivateRoute user={user}>
               <RetailerDashboard />
             </PrivateRoute>
           }
         />
         {/*/ Admin Dashboard */}
        <Route
           path="/admin-dashboard"
           element={
             <PrivateRoute user={user}>
               <AdminDashboard />
             </PrivateRoute>
           }
         />
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;