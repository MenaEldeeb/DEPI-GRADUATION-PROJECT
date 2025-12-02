import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isLogin, setLogin } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setLogin(null);
  };

  const navItems = ["Home", "Men", "Women", "Kids", "Handmade", "Carts", "Dashboard"];

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${styles.navbar}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Dream</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {navItems.map(item => (
              <li className="nav-item" key={item}>
                <Link className="nav-link" to={`/${item.toLowerCase()}`}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center">
            {isLogin ? (
              <>
                <div className={styles.cartContainer}>
                  <Link to="/carts" className="text-success me-3 position-relative">
                    <i className="fa-solid fa-cart-shopping fa-lg"></i>
                    {cart.length > 0 && <span className={styles.badge}>{cart.length}</span>}
                  </Link>
                </div>
                <button className="btn btn-custom btn-sm fw-bold" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-custom btn-sm me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-custom btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}