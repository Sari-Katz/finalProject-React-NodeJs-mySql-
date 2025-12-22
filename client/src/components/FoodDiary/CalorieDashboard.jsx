import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import ApiUtils from '../../utils/ApiUtils';
import './CalorieDashboard.css';

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
        // ✅ תיקון: בלי ירידת שורה באמצע ה-URL
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
    return <div className="loading-state">טוען נתונים...</div>;
  }

  if (!dailyGoal) {
    return <Navigate to="/calorie-dashboard/calorie-setup" replace />;
  }

  const remainingCalories = dailyGoal - consumedCalories + burnedCalories;
  const progressPercentage =
    dailyGoal > 0 ? Math.min((consumedCalories / dailyGoal) * 100, 100) : 0;

  // Navigation handlers
  const goToAddMeal = () => navigate('/calorie-dashboard/add-meal');
  const goToCalorieSetup = () => navigate('/calorie-dashboard/calorie-setup');
  const goToAddActivity = () => navigate('/calorie-dashboard/add-activity');

  // ✅ חדש: המלצות לארוחות
  const goToMealRecommendations = () =>
    navigate('/calorie-dashboard/meal-recommendations', {
      state: {
        dailyGoal,
        consumedCalories,
        burnedCalories,
        remainingCalories,
      },
    });

  return (
    <div className="food-diary-container">
      <header className="diary-header">
        <h1>יומן התזונה שלי</h1>
        <p>מעקב חכם אחר תזונה ופעילות גופנית בעזרת AI</p>
      </header>

      <section className="calorie-summary">
        <h2>התקדמות יומית</h2>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
            {Math.round(consumedCalories)} קלוריות
          </div>
        </div>

        <div className="calorie-details">
          <span>נצרכו: <strong>{consumedCalories}</strong></span>
          <span>נשרפו: <strong>{burnedCalories}</strong></span>
          <span>נותרו: <strong>{remainingCalories}</strong></span>
          <span>יעד יומי: <strong>{dailyGoal}</strong></span>
        </div>
      </section>

      <section className="actions">
        <button onClick={goToAddMeal} className="add-meal-btn">
          📸 הוספת ארוחה
        </button>

        <button onClick={goToCalorieSetup} className="setup-goal-btn">
          🎯 עדכון יעד קלורי
        </button>

        <button onClick={goToAddActivity} className="add-activity-btn">
          🏃‍♀️ הוספת פעילות גופנית
        </button>

        {/* ✅ חדש: כפתור המלצות */}
        <button onClick={goToMealRecommendations} className="recommendations-btn">
          🍽️ המלצות לארוחות לפי הקלוריות שנותרו
        </button>
      </section>
    </div>
  );
};

export default CalorieDashboard;
