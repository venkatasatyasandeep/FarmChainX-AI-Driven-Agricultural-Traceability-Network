import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
import "../../styles/products.css";

function ProductsPage({ products = [], onDeleteProduct, onRefreshProducts }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredProducts(products);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [products]);

  // ✅ Dynamic Base URL
  const getBaseUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:3000";
    }
    return "https://farmchainx.netlify.app";
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (onDeleteProduct) {
        onDeleteProduct(productId);
      } else {
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        if (onRefreshProducts) onRefreshProducts();
      }
    }
  };

  // ✅ Download QR Code
  const downloadQRCode = (id) => {
    const canvas = document.querySelector(`#qrcode-${id} canvas`);
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `product-${id}-qrcode.png`;
    link.click();
  };

  // ✅ Filter products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (prod) =>
            prod.cropType.toLowerCase().includes(q) ||
            prod.soilType.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, products]);

  return (
    <div className="products-container">
      {/* 🔹 Header */}
        <h1 className="page-title">Farm Products</h1>
         <div className="page-header">
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search by crop or soil..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
  </div>

  <div className="header-buttons">
    <button className="add-btn" onClick={() => navigate("/add-product")}>
      + Add Product
    </button>
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>

      {/* 🔹 Loading State */}
      {loading ? (
        <div className="loading">⏳ Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        // 🔹 Empty State
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try adjusting your search or add a new product.</p>
          <button
            className="btn add-btn"
            onClick={() => navigate("/add-product")}
          >
            <span>➕</span> Add Your First Product
          </button>
        </div>
      ) : (
        // 🔹 Products Table
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
                {filteredProducts.map((prod, index) => (
                  <tr key={prod.id || index}>
                    {/* 🔹 Product Image */}
                    <td>
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.cropType}
                          className="product-img"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjRUVFRUVFIi8+Cjx0ZXh0IHg9IjM1IiB5PSIzNSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=";
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>

                    {/* 🔹 Product Details */}
                    <td>{prod.cropType}</td>
                    <td>{prod.soilType}</td>
                    <td>{prod.pesticides}</td>
                    <td>{prod.harvestDate}</td>
                    <td>{prod.latitude}</td>
                    <td>{prod.longitude}</td>

                    {/* 🔹 QR Code */}
                    <td>
                      <div className="qr-container">
                        <QRCodeCanvas
                          id={`qrcode-${prod.id}`}
                          value={`${getBaseUrl()}/product/${prod.id}`}
                          size={80}
                        />
                        <div className="product-id">ID: {prod.id}</div>
                        <button
                          className="btn qr-btn"
                          onClick={() => downloadQRCode(prod.id)}
                        >
                          ⬇️ QR
                        </button>
                      </div>
                    </td>

                    {/* 🔹 Actions */}
                    <td className="actions-cell">
                      <button
                        className="btn edit-btn"
                        onClick={() => navigate(`/edit-product/${prod.id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteProduct(prod.id)}
                      >
                        🗑️ Delete
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
