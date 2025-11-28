import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Handmade() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  function getProducts() {
    setIsLoading(true);
    setError(null);

    axios
      .get("/Handmade.json")
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Handmade products:", error);
        setError("Failed to load Handmade products.");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getProducts();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (isLoading) return <p className="text-center my-5">Loading...</p>;
  if (error) return <p className="text-center my-5 text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Handmade Products</h2>

      {isMobile ? (
        <div className="mobile-list">
          {products.map((product) => (
            <div key={product.id} className="mobile-card">
              <div className="card shadow-sm h-100 border-0 rounded-3 hover-scale">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-truncate">{product.title}</h5>
                  <p className="text-muted small mb-1">Category: {product.category}</p>
                  <p className="text-success h6 mb-2">${product.price}</p>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product }}
                    className="btn btn-sm btn-outline-success w-100"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Slider {...sliderSettings} key={products.length}>
          {products.map((product) => (
            <div key={product.id} className="p-2">
              <div className="card shadow-sm h-100 border-0 rounded-3 hover-scale">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-truncate">{product.title}</h5>
                  <p className="text-muted small mb-1">Category: {product.category}</p>
                  <p className="text-success h6 mb-2">${product.price}</p>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product }}
                    className="btn btn-sm btn-outline-success w-100"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}

      <style>{`
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .slick-prev:before, .slick-next:before {
          color: #28a745;
          font-size: 25px;
        }
        .mobile-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mobile-card {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
