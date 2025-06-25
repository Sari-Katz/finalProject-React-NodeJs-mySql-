import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

// Import של כל האייקונים
import medalIcon from '../../img/medal.png';
import groupIcon from '../../img/group.png';
import alarmClockIcon from '../../img/alarm-clock.png';
import gpsIcon from '../../img/gps.png';
import protectIcon from '../../img/protect.png';
import checklistIcon from '../../img/checklist.png';
import goalIcon from '../../img/goal.png';

const Home = () => {
    const features = [
        {
            icon: medalIcon,
            title: "מקצועיות",
            description: "הדרכות מוסמכת ונסיון רחב של יותר מ-7 שנים, עם דגש על ערכי איכות יוצאי מן הכלל למקצועות אישיות."
        },
        {
            icon: groupIcon,
            title: "ציוד מתקדם",
            description: "ציוד פילאטיס מתקדם ברמה הגבוהה וציוד האימון לצורכי האימון לשיפור הביצועים והאבזרים"
        },
        {
            icon: alarmClockIcon,
            title: "שעות נוחות",
            description: "ימי ראשון עד חמישי: 7:00 עד 23:00, שישי: בוקר 7:00-14:00, מוצ\"ש: ערב 21:30-23:30"
        },
        {
            icon: gpsIcon,
            title: "מיקום מרכזי",
            description: "הכתובת: הקונגרס הציוני 11, 360 מעל הקניון. נוח להגעה ונגיש לכולם"
        },
        {
            icon: protectIcon,
            title: "בטיחות מלאה",
            description: "הקפדה על בטיחות ובריאות עם ליווי מוסמך מדריכה מקצועית לשמירה על בטיחות המתאמנות."
        },
        {
            icon: checklistIcon,
            title: "מגוון פעילויות",
            description: "שיעורי טון מתקדמים כמו פילאטיס, חיטוב וכוח. המתאמצים לשפר בין טוב מאימון לתכנון מדויק"
        },
        {
            icon: goalIcon,
            title: "מטרות אישיות",
            description: "מגוון תוכניות מותאמות צרכים כמו חיזוק הגוף לפני ואחרי לידה, ירידת משקל, כלבטון יציבה ועוד"
        },
        {
            icon: medalIcon,
            title: "איכות גבוהה",
            description: "שירות ברמה הגבוהה ביותר עם יחס אישי והתאמה מלאה לרצונות ויכולות של כל מתאמנת"
        }
    ];

    const testimonials = [
        {
            name: "שרה כהן",
            text: "טובה הפכה את הספורט בשבילי לחוויה מהנה! השיעורים מותאמים אישית והתוצאות מדברות בעד עצמן.",
            rating: 5
        },
        {
            name: "מירי לוי",
            text: "אחרי שנים של חיפוש מצאתי את המקום הנכון. האווירה כאן מדהימה והטיפול אישי ברמה גבוהה.",
            rating: 5
        },
        {
            name: "רחל אברהם",
            text: "כנשים בהריון קיבלתי יחס מקצועי ומותאם. טובה יודעת בדיוק איך להתאים את התרגילים לכל שלב.",
            rating: 5
        },
        {
            name: "דנה רוזן",
            text: "הסטודיו הכי נעים שהכרתי! השיעורים מגוונים והמאמנת מקצועית ובעלת סבלנות אינסופית.",
            rating: 5
        }
    ];

    return (
        <div className={styles.homeContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.textContent}>
                        <h1 className={styles.mainTitle}>!ברוכה הבאה לסטודיו שלי</h1>
                        <h2 className={styles.subtitle}>טובה - מאמנת פילאטיס וכושר</h2>
                        
                        <p className={styles.description}>
                            מזמינה אותך להצטרף אליי למסע של שינוי, חיזוק והתחדשות.
                            בסטודיו שלי תוכלי ליהנות ממגוון שיעורים מותאמים אישית, 
                            בקבוצות קטנות ובאווירה חמה ותומכת – בדיוק כמו שמגיע לך.
                        </p>

                        <p className={styles.vision}>
                            <strong>החזון שלי הוא פשוט:</strong> להפוך את האימון לחוויה. 
                            כזו שתרצי לחזור אליה שוב ושוב. יחד נבנה שגרה שמקדמת אותך – 
                            לא רק מבחינה גופנית, אלא גם בתחושת הביטחון, האנרגיה והחיוניות ביום-יום.
                        </p>

                        <div className={styles.servicesList}>
                            <div className={styles.serviceItem}>💪 שיעורי עיצוב וחיטוב</div>
                            <div className={styles.serviceItem}>🧘 אימוני יוגה ופילאטיס</div>
                            <div className={styles.serviceItem}>🔥 אימוני כוח וHIIT</div>
                            <div className={styles.serviceItem}>🫶 ליווי אישי ויחס אישי</div>
                        </div>
                    </div>
                    
                    <div className={styles.imageContent}>
                        <div className={styles.heroImage}></div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>למה כדאי להגיע לסטודיו שלנו?</h2>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <img 
                                src={feature.icon} 
                                alt={feature.title}
                                className={styles.featureIcon}
                            />
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonialsSection}>
                <h2 className={styles.sectionTitle}>מה הלקוחות שלנו אומרות</h2>
                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.stars}>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className={styles.star}>⭐</span>
                                ))}
                            </div>
                            <p className={styles.testimonialText}>"{testimonial.text}"</p>
                            <h4 className={styles.testimonialName}>- {testimonial.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Special Message */}
            <section className={styles.specialMessage}>
                <div className={styles.messageCard}>
                    <h3>הודעה מיוחדת לנשים בהריון 🤱</h3>
                    <p>
                        את יכולה להצטרף לכל שיעור פילאטיס ואתאים לך את התרגול במיוחד!
                        אני כאן, בודקת תוך כדי תנועה את האימונים והצורך להוסיף שיעור.
                    </p>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>מוכנה להתחיל?</h2>
                    <p>בואי לעשות צעד בשביל עצמך. אני פה בשבילך – עם כל הלב והניסיון.</p>
                    
                    <div className={styles.ctaButtons}>
                        <Link to="/schedule" className={styles.primaryBtn}>
                            צפייה בלוח השיעורים
                        </Link>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=הקונגרס+הציוני+11+ירושלים"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.secondaryBtn}
                        >
                            איך מגיעים אלינו?
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;