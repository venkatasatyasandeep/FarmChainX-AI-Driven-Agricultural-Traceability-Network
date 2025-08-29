// src/pages/ProductDetail.js
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find(p => String(p.id) === id);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div>
      <h1>{product.cropType}</h1>
      <p>Soil: {product.soilType}</p>
      <p>Pesticides: {product.pesticides}</p>
      <p>Harvest: {product.harvestDate}</p>
      <p>Location: {product.latitude}, {product.longitude}</p>
      {product.image && <img src={product.image} alt={product.cropType} />}
    </div>
  );
}

export default ProductDetail;
