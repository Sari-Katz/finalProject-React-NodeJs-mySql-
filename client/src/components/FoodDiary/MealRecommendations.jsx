import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiUtils from '../../utils/ApiUtils';
import styles from './MealRecommendations.module.css';

const MealRecommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await ApiUtils.get(
          `${import.meta.env.VITE_API_URL}/food-diary/meal-recommendations`
        );
        setData(res);
      } catch (err) {
        setError('לא הצלחנו להביא המלצות לארוחה 😢');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>טוען המלצות חכמות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>😢</div>
        <p className={styles.errorText}>{error}</p>
        <button 
          className={styles.retryBtn} 
          onClick={() => window.location.reload()}
        >
          נסה שוב
        </button>
      </div>
    );
  }

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
        <h1 className={styles.mainTitle}>🍽️ המלצות חכמות לארוחה</h1>
        <p className={styles.subtitle}>המלצות מותאמות אישית בהתאם ליעד הקלורי שלך</p>
      </header>

      <div className={styles.mealTypeSection}>
        <div className={styles.mealTypeBadge}>
          <span className={styles.mealTypeIcon}>🍴</span>
          <span className={styles.mealTypeText}>{data.mealType}</span>
        </div>
      </div>

      <div className={styles.recommendationsGrid}>
        {data.recommendations.map((meal, index) => (
          <div key={index} className={styles.recommendationCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.mealName}>{meal.name}</h3>
              <div className={styles.caloriesBadge}>
                🔥 {meal.estimatedCalories} קלוריות
              </div>
            </div>

            <p className={styles.description}>{meal.description}</p>

            <div className={styles.cardFooter}>
              <button className={styles.selectBtn}>
                בחר ארוחה זו
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealRecommendations;