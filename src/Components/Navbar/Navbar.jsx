import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/CartContext";
export default function NavbarTop() {
  const { isLogin, setLogin } = useContext(UserContext);
   const {  Cart } = useContext(CartContext);
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setLogin(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top w-100">
      <div className="container-fluid">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold me-4" to="/">Dream</Link>

        {/* Toggle Button for Mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          {isLogin ? (
            <>
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/men">Men</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/women">Women</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/kids">Kids</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/handmade">Handmade</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/carts">Carts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Dashboard">Dashboard</Link>
                </li>
              </ul>

              <button className="btn btn-light btn-sm text-success fw-bold" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="ms-auto d-flex">
              <Link className="btn btn-outline-light btn-sm me-2" to="/login">Login</Link>
              <Link className="btn btn-light btn-sm text-success fw-bold" to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

