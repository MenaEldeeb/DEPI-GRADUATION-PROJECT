
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import img from "../../assets/images/store.jpeg";

export default function Home() {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <div
      className={styles.homeContainer}
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}> Welcome to Dream  Store </h1>

        {!showButtons ? (
          <button
            className={styles.shopBtn}
            onClick={() => setShowButtons(true)}
          >
            Shop Now
          </button>
        ) : (
          <div className={styles.categories}>
            <Link to="/men" className={styles.catBtn}>Men</Link>
            <Link to="/women" className={styles.catBtn}>Women</Link>
            <Link to="/kids" className={styles.catBtn}>Kids</Link>
            <Link to="/Handmade" className={styles.catBtn}>Handmade</Link>
          </div>
        )}
      </div>
    </div>
  );
}