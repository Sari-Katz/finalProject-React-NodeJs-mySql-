import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
        <Link to="/login" className={styles.personalAreaBtn} onClick={logout}>log out</Link>
      </div>

      <div className={styles.burger} onClick={toggleMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>

      <div className={`${styles.navCenter} ${isOpen ? styles.open : ''}`}>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          מערכת שעות
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          פוסטים
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          אודות
        </NavLink>
        <NavLink to="/Subscription" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          הרשמה למנוי
        </NavLink>
        {user.role == 'admin' && <NavLink to="/ManageClasses" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          ניהול קורסים
        </NavLink>}
           {user.role == 'admin' && <NavLink to="/ManageChallanges" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          ניהול אתגרים
        </NavLink>}
      </div>

      <div className={styles.navRight}>
        {location.pathname !== "/profile" && (
          <NavLink to="/profile" className={styles.personalAreaBtn}>אזור אישי</NavLink>
        )}
      </div>
    </nav>
  );
}

export default Nav;