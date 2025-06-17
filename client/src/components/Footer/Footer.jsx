import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoText}>TOVA</div>
          <div className={styles.logoSubtitle}>מאמנת פילאטיס וכושר</div>
        </div>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.icon}>📱</span>
            <a href="tel:0548493746" className={styles.contactLink}>054-849-3746</a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.icon}>📧</span>
            <a href="mailto:tova746@gmail.com" className={styles.contactLink}>tova746@gmail.com</a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.icon}>📍</span>
            <span className={styles.contactText}>הקונגרס הציוני 11, 360 מעל הקניון</span>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© 2025 טובה - כל הזכויות שמורות</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;