// PageNotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PageNotFound.module.css';

function PageNotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* אייקון גדול */}
                <div className={styles.iconContainer}>
                    <div className={styles.icon404}>404</div>
                    <div className={styles.iconSad}>😔</div>
                </div>

                {/* כותרת ראשית */}
                <h1 className={styles.title}>אופס! הדף לא נמצא</h1>
                
                {/* הודעת משנה */}
                <p className={styles.subtitle}>
                    נראה שהדף שחיפשת לא קיים או הועבר למקום אחר
                </p>
                {/* כפתורי פעולה */}
                <div className={styles.actions}>
                    <button onClick={handleGoHome} className={styles.primaryButton}>
                        🏠 חזרה לעמוד הבית
                    </button>
                    <button onClick={handleGoBack} className={styles.secondaryButton}>
                        ← חזרה לדף הקודם
                    </button>
                </div>

                {/* אלמנט דקורטיבי */}
                <div className={styles.decorativeElements}>
                    <div className={styles.circle}></div>
                    <div className={styles.triangle}></div>
                    <div className={styles.square}></div>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;