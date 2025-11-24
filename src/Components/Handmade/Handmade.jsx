

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Handmade.module.css";

export default function Handmade() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/Handmade.json");
        setProducts(response.data || []);
      } catch {
        setError("Failed to load Handmade products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.price) return false;
    if (priceFilter === "low") return p.price < 20;
    if (priceFilter === "mid") return p.price >= 20 && p.price <= 35;
    if (priceFilter === "high") return p.price > 35;
    return true;
  });

  const sortedProducts = [...filteredProducts];
  if (sortOrder === "asc") sortedProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") sortedProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="container my-5">
      <h2 className="text-center mt-4 fw-bold">Handmade Products</h2>

      <div className={styles.filters}>
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

      {!isLoading && !error && sortedProducts.length === 0 && (
        <div className="alert alert-info text-center">No products found.</div>
      )}

      {!isLoading && !error && sortedProducts.length > 0 && (
        <div className="row g-4">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
            >
              <div className={styles.cardWrapper}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardBody}>
                  <h5 className={styles.cardTitle}>{product.title}</h5>
                  <p className="text-muted small">
                    Category: {product.category}
                  </p>
                  <p className={styles.cardDescription}>
                    {product.description
                      ? product.description.split(" ").slice(0, 10).join(" ") +
                        "..."
                      : "No description available."}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className="h5 text-success mb-0">${product.price}</span>
                    <Link
                      to={`/product/${product.id}`}
                      state={{ product }}
                      className={`btn btn-sm btn-outline-success ${styles.btnView}`}
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
