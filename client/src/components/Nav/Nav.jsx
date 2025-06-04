import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import { AuthContext } from '../AuthContext';
import { useLocation } from 'react-router-dom';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
const location = useLocation();

const isActive = (path) => location.pathname === path;
  return (
    <nav className={styles.navContainer}>
      <div className={styles.navLeft}>
        {/* <div className={styles.logo}></div> */}
        <Link to="/login" className={styles.personalAreaBtn} onClick={logout}>log out</Link>
      </div>

      <div className={styles.burger} onClick={toggleMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>

      <div className={`${styles.navCenter} ${isOpen ? styles.open : ''}`}>
        <Link to="/schedule" className={styles.navLink}>מערכת שעות</Link>
        <Link to="/posts" className={styles.navLink}>פוסטים</Link>
        <Link to="/about" className={styles.navLink}>אודות</Link>
      </div>

      <div className={styles.navRight}>
        <Link to="/profile" className={styles.personalAreaBtn}>אזור אישי</Link>
      </div>
    </nav>
  );
}

export default Nav;