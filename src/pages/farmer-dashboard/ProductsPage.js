
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/App.css";

function ProductsPage({ products = [], onDeleteProduct, onRefreshProducts }) {
  const navigate = useNavigate();

  // Function to get the base URL dynamically
  const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'https://farmchainx.netlify.app';
    }
    return 'http://localhost:3000';
  };
  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (onDeleteProduct) {
        onDeleteProduct(productId);
      } else {
        // Fallback if no callback provided
        const updatedProducts = products.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        if (onRefreshProducts) onRefreshProducts();
      }
    }
  };

  return (
    <div className="products-container">
      {/* Header with title and buttons */}
      <div className="page-header">
        <h1 className="page-title">Farm Products</h1>
        <div className="header-buttons">
          <button className="btn add-btn" onClick={() => navigate("/add-product")}>
            <span>➕</span> Add Product
          </button>
          <button className="btn logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products available</h2>
          <p>Get started by adding your first farm product</p>
          <button className="btn add-btn" onClick={() => navigate("/add-product")}>
            <span>➕</span> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Crop Type</th>
                  <th>Soil Type</th>
                  <th>Pesticides</th>
                  <th>Harvest Date</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, index) => (
                  <tr key={prod.id || index}>
                    <td>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.cropType}
                          className="product-img"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjRUVFRUVFIi8+Cjx0ZXh0IHg9IjM1IiB5PSIzNSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=";
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{prod.cropType}</td>
                    <td>{prod.soilType}</td>
                    <td>{prod.pesticides}</td>
                    <td>{prod.harvestDate}</td>
                    <td>{prod.latitude}</td>
                    <td>{prod.longitude}</td>
                    <td>
                      <QRCodeCanvas 
                        value={`${getBaseUrl()}/product/${prod.id}`} 
                        size={80} 
                      />
                      <div className="product-id">ID: {prod.id}</div>
                    </td>
                    <td>
                      <button 
                        className="btn delete-btn"
                        onClick={() => handleDeleteProduct(prod.id)}
                        title="Delete product"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;