import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
          <div className={styles.image}></div>
            <div className={styles.content}>
                <h1>ברוכה הבאה!</h1>
                <p>
                    אני טובה, מאמנת כושר אישית ומקצועית, ומזמינה אותך להצטרף אליי למסע של שינוי, חיזוק והתחדשות.<br />
                    בסטודיו שלי תוכלי ליהנות ממגוון שיעורים מותאמים אישית, בקבוצות קטנות ובאווירה חמה ותומכת – בדיוק כמו שמגיע לך.
                </p>
                <p>
                    החזון שלי הוא פשוט: להפוך את האימון לחוויה. כזו שתרצי לחזור אליה שוב ושוב.<br />
                    יחד נבנה שגרה שמקדמת אותך – לא רק מבחינה גופנית, אלא גם בתחושת הביטחון, האנרגיה והחיוניות ביום-יום.
                </p>
                <ul>
                    <li>💪 שיעורי עיצוב וחיטוב</li>
                    <li>🧘 אימוני יוגה ופילאטיס</li>
                    <li>🔥 אימוני כוח וHIIT</li>
                    <li>🫶 ליווי אישי, יחס אישי והמון תשומת לב למה שמתאים לך</li>
                </ul>
                <p>
                    בין אם את רק מתחילה או כבר שוחה בעולם הכושר – כאן תמצאי מקום שהוא הרבה יותר מעוד סטודיו.<br />
                    אז בואי לעשות צעד בשביל עצמך. אני פה בשבילך – עם כל הלב והניסיון.<br />
                    כמובן אני כאן, בודקת תוך כדי תנועה את האימונים והצורך בלהוסיף שיעור.<br />
                    נשים בהריון - את יכולה להצטרף לכל שיעור פילאטיס ואתאים לך את התרגול!
                </p>
                <div className={styles.cssWay}></div>
                    <span>רוצה לדעת איך להגיע? </span>
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=your+studio+address"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cssWayLink}
                    >
                        לחצי כאן לדרך ב-Google Maps
                    </a>
                </div>
            </div>
    );
};

export default Home;
