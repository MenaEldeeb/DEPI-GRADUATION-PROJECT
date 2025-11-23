import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Men() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  const endpoints = [
    'https://dummyjson.com/products/category/mens-shirts',
    'https://dummyjson.com/products/category/mens-shoes',
    'https://dummyjson.com/products/category/fragrances',
    'https://dummyjson.com/products/category/mens-watches',
  ];

  function getProducts() {
    setIsLoading(true);
    setError(null);

    const requests = endpoints.map(endpoint => axios.get(endpoint));

    Promise.all(requests)
      .then(responses => {
        const combinedData = [];

        responses.forEach(response => {
          if (response.data && Array.isArray(response.data.products)) {
            combinedData.push(...response.data.products);
          }
        });

        setProducts(combinedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products. Please check your connection.");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  // -------- Filter + Sort --------
  let filteredProducts = products;

  // Filter by price
  if (priceFilter === "low") {
    filteredProducts = products.filter(p => p.price < 100);
  }
  if (priceFilter === "mid") {
    filteredProducts = products.filter(p => p.price >= 100 && p.price <= 300);
  }
  if (priceFilter === "high") {
    filteredProducts = products.filter(p => p.price > 300);
  }

  // Sort by price
  if (sortOrder === "asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }
  if (sortOrder === "desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Men Products</h2>

      {/* Filter + Sort Controls */}
      <div className="d-flex justify-content-end mb-4 gap-3">

        <select
          className="form-select w-auto"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="low">Under $100</option>
          <option value="mid">$100 - $300</option>
          <option value="high">Above $300</option>
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

      {/* Loading */}
      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary"></div>
          <p>Loading men's products...</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* No products */}
      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="alert alert-info text-center">No products found.</div>
      )}

      {/* Products */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="row">
          {filteredProducts.map((productInfo) => (
            <div key={productInfo.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">

              <div className="card shadow-sm h-100">

                <img
                  src={productInfo.thumbnail || productInfo.images?.[0]}
                  alt={productInfo.title}
                  className="w-100"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{productInfo.title}</h5>

                  <p className="text-muted small">Category: {productInfo.category}</p>

                  <p className="flex-grow-1 small">
                    {productInfo.description.split(" ").slice(0, 10).join(" ") + "..."}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="h5 text-success mb-0">${productInfo.price}</span>

                   <Link
  to={`/product/${productInfo.id}`}
  state={{ product: productInfo }}
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
