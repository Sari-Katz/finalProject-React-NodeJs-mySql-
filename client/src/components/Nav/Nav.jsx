import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css'; 

function Nav(){
    const { user, logout } = useContext(AuthContext);
    // const navigate = useNavigate();
    // const { userData, setUserData } = useUserContext();
    // const handleLogout = () => {
    //     localStorage.removeItem('currentUser');
    //     setUserData({ username: '', id: '' });
    // };

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navLeft}>
                <div className={styles.logo}></div>
                {/* <button className={styles.personalAreaBtn}>log out</button> */}
                {/* <Link to="/login" className={styles.personalAreaBtn} onClick={()=>{localStorage.removeItem('currentUser')}}>log out</Link> */}
            </div>
            <div className={styles.navCenter}>
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