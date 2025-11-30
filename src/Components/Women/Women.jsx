

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Women.module.css";

export default function Women() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/Women.json");
        setProducts(response.data);
      } catch {
        setError("Failed to load Women products.");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 250,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (isLoading) return <p className="text-center my-5">Loading...</p>;
  if (error) return <p className="text-center my-5 text-danger">{error}</p>;

  return (
    <div className="container" style={{ paddingTop: "80px" }}>
      <div
        className={styles.banner}
        style={{ backgroundImage: "url('/Men-banner.jpg')" }}
      >
        <h2 className="fw-bold">Women Products</h2>
      </div>

      <div className={styles.desktopSlider}>
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} className="p-2">
              <div className={`card shadow-sm h-100 border-0 rounded-3 ${styles.hoverScale}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className={`${styles.productImg} ${styles.productImgDesktop}`}
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
      </div>

      <div className={styles.mobileList}>
        {products.map((product) => (
          <div key={product.id} className={styles.mobileCard}>
            <div className={`card shadow-sm h-100 border-0 rounded-3 ${styles.hoverScale}`}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className={`${styles.productImg} ${styles.productImgMobile}`}
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
    </div>
  );
}
