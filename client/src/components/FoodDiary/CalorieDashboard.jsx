import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import ApiUtils from '../../utils/ApiUtils';
import styles from './CalorieDashboard.module.css';

const CalorieDashboard = () => {
  const [dailyGoal, setDailyGoal] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayCalories = async () => {
      setIsLoading(true);
      try {
        const data = await ApiUtils.get(
          `${import.meta.env.VITE_API_URL}/food-diary/today`
        );
        console.log('Fetched calorie data:', data);
        setDailyGoal(data.daily_calorie_goal);
        setConsumedCalories(data.consumed_calories);
        setBurnedCalories(data.burned_calories);
      } catch (error) {
        console.error('Failed to fetch calorie data', error);
        setDailyGoal(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayCalories();
  }, []);

  if (isLoading) {
    return <div className={styles.loadingState}>טוען נתונים...</div>;
  }

  if (!dailyGoal) {
    return <Navigate to="/calorie-dashboard/calorie-setup" replace />;
  }

  const remainingCalories = dailyGoal - consumedCalories + burnedCalories;
  const netCalories = consumedCalories - burnedCalories;
  const progressPercentage = dailyGoal > 0 ? Math.min((netCalories / dailyGoal) * 100, 100) : 0;
  const isOverLimit = netCalories > dailyGoal;

  // Navigation handlers
  const goToAddMeal = () => navigate('/calorie-dashboard/add-meal');
  const goToCalorieSetup = () => navigate('/calorie-dashboard/calorie-setup');
  const goToAddActivity = () => navigate('/calorie-dashboard/add-activity');
  const goToMealRecommendations = () =>
    navigate('/calorie-dashboard/meal-recommendations', {
      state: {
        dailyGoal,
        consumedCalories,
        burnedCalories,
        remainingCalories,
      },
    });

  const circleRadius = 85;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleDashoffset = circleCircumference * (1 - progressPercentage / 100);

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>יומן התזונה שלי</h1>
          <p className={styles.subtitle}>מעקב חכם אחר תזונה ופעילות גופנית בעזרת AI 🤖</p>
        </div>
      </header>

      {/* Summary Section */}
      <section className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>התקדמות יומית</h2>
        
        {/* Progress Circle */}
        <div className={styles.progressCircleContainer}>
          <svg width="200" height="200" className={styles.progressCircle}>
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              fill="none"
              stroke="#e8f5ea"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              fill="none"
              stroke={isOverLimit ? '#ff6b6b' : '#2d7738'}
              strokeWidth="12"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className={styles.progressCircleBar}
            />
          </svg>
          <div className={styles.progressText}>
            <div className={`${styles.calorieNumber} ${isOverLimit ? styles.calorieNumberOver : ''}`}>
              {Math.round(netCalories)}
            </div>
            <div className={styles.calorieLabel}>מתוך {dailyGoal}</div>
            <div className={styles.calorieSubtext}>קלוריות נטו</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardConsumed}`}>
            <div className={styles.statIcon}>🍽️</div>
            <div className={styles.statValue}>{consumedCalories}</div>
            <div className={styles.statLabel}>נצרכו</div>
          </div>
          
          <div className={`${styles.statCard} ${styles.statCardBurned}`}>
            <div className={styles.statIcon}>🔥</div>
            <div className={styles.statValue}>{burnedCalories}</div>
            <div className={styles.statLabel}>נשרפו</div>
          </div>
          
          <div className={`${styles.statCard} ${styles.statCardRemaining} ${isOverLimit ? styles.statCardOverLimit : ''}`}>
            <div className={styles.statIcon}>{isOverLimit ? '⚠️' : '✨'}</div>
            <div className={styles.statValue}>{Math.abs(remainingCalories)}</div>
            <div className={styles.statLabel}>{isOverLimit ? 'חריגה' : 'נותרו'}</div>
          </div>
        </div>

        {/* Status Message */}
        {isOverLimit && (
          <div className={styles.warningMessage}>
            ⚠️ חרגת מיעד הקלוריות היומי ב-{netCalories - dailyGoal} קלוריות
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <section className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>פעולות מהירות</h2>
        
        <div className={styles.actionsGrid}>
          <button onClick={goToAddMeal} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
            <span className={styles.btnIcon}>📸</span>
            <span className={styles.btnText}>הוספת ארוחה</span>
          </button>
          
          <button onClick={goToCalorieSetup} className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
            <span className={styles.btnIcon}>🎯</span>
            <span className={styles.btnText}>עדכון יעד קלורי</span>
          </button>
          
          <button onClick={goToAddActivity} className={`${styles.actionBtn} ${styles.actionBtnTertiary}`}>
            <span className={styles.btnIcon}>🏃‍♀️</span>
            <span className={styles.btnText}>הוספת פעילות</span>
          </button>
          
          <button onClick={goToMealRecommendations} className={`${styles.actionBtn} ${styles.actionBtnSpecial}`}>
            <span className={styles.btnIcon}>🍽️</span>
            <span className={styles.btnText}>המלצות לארוחות</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default CalorieDashboard;