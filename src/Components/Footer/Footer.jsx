import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <h3 className={styles.title}>DreamSTORE</h3>

        <p className={styles.text}>
          Your perfect destination for stylish fashion and accessories.
        </p>

        <div className={styles.social}>
          <a href="#" className={styles.circle}><FaFacebookF /></a>
          <a href="#" className={styles.circle}><FaTwitter /></a>
          <a href="#" className={styles.circle}><FaLinkedinIn /></a>
          <a href="#" className={styles.circle}><FaInstagram /></a>
        </div>

        <p className={styles.copy}>© 2025 DreamStore. All Rights Reserved.</p>

      </div>
    </footer>
  );
}



