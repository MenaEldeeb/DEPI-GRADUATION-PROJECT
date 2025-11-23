import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Kids() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  function getProducts() {
    setIsLoading(true);
    setError(null);

    axios
      .get("/Kids-products.json")
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching kids products:", error);
        setError("Failed to load kids products.");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  let filteredProducts = products;

  if (priceFilter === "low")
    filteredProducts = products.filter((p) => p.price < 20);
  if (priceFilter === "mid")
    filteredProducts = products.filter((p) => p.price >= 20 && p.price <= 35);
  if (priceFilter === "high")
    filteredProducts = products.filter((p) => p.price > 35);

  if (sortOrder === "asc")
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  if (sortOrder === "desc")
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Kids Products</h2>

      <div className="d-flex justify-content-end mb-4 gap-3">
        <select
          className="form-select w-auto"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="low">Under $20</option>
          <option value="mid">$20 - $35</option>
          <option value="high">Above $35</option>
        </select>

        <select
          className="form-select w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary"></div>
          <p>Loading products...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="alert alert-info text-center">No products found.</div>
      )}

      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card shadow-sm h-100">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-100"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{product.title}</h5>
                  <p className="text-muted small">Category: {product.category}</p>
                  <p className="flex-grow-1 small">
                    {product.description
                      ? product.description.split(" ").slice(0, 10).join(" ") + "..."
                      : "No description available."}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="h5 text-success mb-0">${product.price}</span>
                    <Link
                      to={`/product/${product.id}`}
                      state={{ product }}
                      className="btn btn-sm btn-outline-success"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}