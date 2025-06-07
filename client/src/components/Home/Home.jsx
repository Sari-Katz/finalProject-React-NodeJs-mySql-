import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Nav from '../Nav/Nav';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.content}>
                <h1>ברוכים הבאים לאתר שלנו!</h1>
                <p>כאן תוכלו למצוא מידע נוסף ולהתחיל לגלוש.</p>
                <Link to="/about" className={styles.link}>למידע נוסף</Link>
            </div>
        </div>
    );
};

export default Home;
