import React, { useEffect, useState } from "react";
import styles from "./Loader.module.css";

export default function Loader() {
  const text = " Dream Store";
  const [displayText, setDisplayText] = useState("");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let index = 0;

    const typing = setInterval(() => {
      setDisplayText(text.substring(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(typing);

        setTimeout(() => {
          setHide(true);
        }, 800);
      }
    }, 120);

    return () => clearInterval(typing);
  }, []);

  return (
    <div
      className={`${styles.loaderContainer} ${hide ? styles.fadeOut : ""}`}
    >
      <h1 className={styles.loaderText}>
        {displayText}
        <span className={styles.cursor}>|</span>
      </h1>
    </div>
  );
}
