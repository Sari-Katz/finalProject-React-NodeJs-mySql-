import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MealAnalysisResult.module.css';
import ApiUtils from '../../utils/ApiUtils';

const MealAnalysisResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dailyGoal, setDailyGoal] = useState(null);


    // Get analysis data passed from the previous page
    const { analysis, remainingCalories } = location.state || {};
    const caloriesAfterMeal =
        remainingCalories != null
            ? remainingCalories - analysis.estimatedCalories
            : null;

    const isOverLimit = remainingCalories >= 0 && caloriesAfterMeal < 0;
    console.log('Received analysis data:', analysis);
    if (!analysis) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>😢</div>
                    <h2 className={styles.errorTitle}>שגיאה</h2>
                    <p className={styles.errorText}>לא נמצאו נתוני ניתוח. אנא חזרי אחורה ונסי שוב.</p>
                    <button
                        onClick={() => navigate('/calorie-dashboard/add-meal')}
                        className={styles.errorBtn}
                    >
                        חזרה להעלאת תמונה
                    </button>
                </div>
            </div>
        );
    }

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Call the backend to log the calories
            await ApiUtils.post(`${import.meta.env.VITE_API_URL}/food-diary/log`, {
                calories: analysis.estimatedCalories
            });

            // Redirect to the dashboard to see the updated progress
            navigate('/calorie-dashboard', { replace: true });

        } catch (err) {
            setError('שגיאה ברישום הארוחה. נסי שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/calorie-dashboard');
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
                aria-label="חזרה אחורה"
            >
                ← חזרה
            </button>

            <header className={styles.header}>
                <div className={styles.headerIcon}>🤖</div>
                <h2 className={styles.mainTitle}>תוצאות ניתוח ה-AI</h2>
                <p className={styles.subtitle}>ה-AI שלנו סיים לנתח את הארוחה שלך!</p>
            </header>

            <div className={styles.contentSection}>
                {/* Analysis Card */}
                <div className={styles.analysisCard}>
                    <h3 className={styles.cardTitle}>
                        <span className={styles.titleIcon}>🍽️</span>
                        ה-AI זיהה את הפריטים הבאים:
                    </h3>

                    <ul className={styles.foodItemsList}>
                        {analysis.foodItems.map((item, index) => (
                            <li key={index} className={styles.foodItem}>
                                <div className={styles.foodItemContent}>
                                    <div className={styles.foodAmount}>{item.amount}</div>
                                    <div className={styles.foodName}>{item.name}</div>
                                </div>
                                {item.calories && (
                                    <div className={styles.foodCalories}>
                                        🔥 {item.calories} קלוריות
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Calories Summary */}
                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <p className={styles.summaryLabel}>הערכה קלורית כוללת:</p>
                        <div className={styles.summaryValue}>{analysis.estimatedCalories}</div>
                        <p className={styles.summaryUnit}>קלוריות</p>
                    </div>

                    <div className={styles.summaryCard}>
                        <p className={styles.summaryLabel}>אם תאכלי את המנה ישארו לך:</p>
                        <div
                            className={`${styles.summaryValue} ${isOverLimit ? styles.overLimit : ''
                                }`}
                        >
                            {caloriesAfterMeal !== null
                                ? isOverLimit
                                    ? `חריגה של ${Math.abs(caloriesAfterMeal)}`
                                    : caloriesAfterMeal
                                : '—'}
                        </div>
                        <p className={styles.summaryUnit}>קלוריות</p>
                    </div>
                </div>
                {/* Confirmation Prompt */}
                <div className={styles.confirmationSection}>
                    <h3 className={styles.confirmTitle}>
                        <span className={styles.confirmIcon}>✨</span>
                        האם לתעד את הארוחה הזו ביומן שלך?
                    </h3>
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.confirmationButtons}>
                        <button
                            onClick={handleCancel}
                            className={styles.btnCancel}
                            disabled={isLoading}
                        >
                            ביטול
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={styles.btnConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    מתעד...
                                </>
                            ) : (
                                <>
                                    <span className={styles.btnIcon}>✓</span>
                                    כן, תעדי ארוחה
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealAnalysisResult;