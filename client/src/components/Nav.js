import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

const Nav = () => {
    return (
        <nav className={styles.navContainer}>
            <div className={styles.navLeft}>
               
                <div className={styles.logoPlaceholder}>לוגו</div>
            </div>
            <div className={styles.navCenter}>
                <Link to="/about" className={styles.navLink}>אודות</Link>
                <Link to="/posts" className={styles.navLink}>פוסטים</Link>
                <Link to="/schedule" className={styles.navLink}>מערכת שעות</Link>
            </div>
            <div className={styles.navRight}>
                <Link to="/profile" className={styles.personalAreaBtn}>אזור אישי</Link>
            </div>
        </nav>
    );
};

export default Nav;