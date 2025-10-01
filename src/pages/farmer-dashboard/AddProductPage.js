import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/App.css";

function AddProductPage({ addProduct }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cropType: "",
    soilType: "",
    pesticides: "",
    harvestDate: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.cropType.trim()) newErrors.cropType = "Crop type is required";
    if (!form.soilType.trim()) newErrors.soilType = "Soil type is required";
    if (!form.pesticides.trim()) newErrors.pesticides = "Pesticides information is required";
    if (!form.harvestDate) newErrors.harvestDate = "Harvest date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (name === "image" && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setForm({ ...form, image: imageUrl });
      setImagePreview(imageUrl);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Generate random coordinates
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lng = (Math.random() * 360 - 180).toFixed(6);

    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      ...form,
      latitude: lat,
      longitude: lng,
    };

    // Use the addProduct function passed as prop
    if (addProduct) {
      addProduct(newProduct);
    } else {
      // Fallback if no callback provided
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = [...existingProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
    
    navigate("/farmer-dashboard");
  };

  const handleBack = () => {
    navigate("/farmer-dashboard");
  };

  return (
    <div className="add-container">
      <h1 className="page-title">Add New Product</h1>
      <form onSubmit={handleSubmit} className="add-form">
        <div>
          <label htmlFor="cropType">Crop Type:</label>
          <input 
            type="text" 
            id="cropType"
            name="cropType" 
            value={form.cropType}
            onChange={handleChange} 
            className={errors.cropType ? "error" : ""}
            placeholder="e.g., Organic Rice, Wheat, Corn"
          />
          {errors.cropType && <span className="error-text">{errors.cropType}</span>}
        </div>

        <div>
          <label htmlFor="soilType">Soil Type:</label>
          <input 
            type="text" 
            id="soilType"
            name="soilType" 
            value={form.soilType}
            onChange={handleChange} 
            className={errors.soilType ? "error" : ""}
            placeholder="e.g., Black Soil, Loamy Soil, Sandy Soil"
          />
          {errors.soilType && <span className="error-text">{errors.soilType}</span>}
        </div>

        <div>
          <label htmlFor="pesticides">Pesticides Used:</label>
          <input 
            type="text" 
            id="pesticides"
            name="pesticides" 
            value={form.pesticides}
            onChange={handleChange} 
            className={errors.pesticides ? "error" : ""}
            placeholder="e.g., Natural Pyrethroids, Neem Oil"
          />
          {errors.pesticides && <span className="error-text">{errors.pesticides}</span>}
        </div>

        <div>
          <label htmlFor="harvestDate">Harvest Date:</label>
          <input 
            type="date" 
            id="harvestDate"
            name="harvestDate" 
            value={form.harvestDate}
            onChange={handleChange} 
            className={errors.harvestDate ? "error" : ""}
          />
          {errors.harvestDate && <span className="error-text">{errors.harvestDate}</span>}
        </div>

        <div>
          <label htmlFor="image">Upload Image:</label>
          <input 
            type="file" 
            id="image"
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Product
          </button>
          <button type="button" className="back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;