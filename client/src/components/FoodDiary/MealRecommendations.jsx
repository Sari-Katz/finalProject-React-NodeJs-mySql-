import React, { useEffect, useState } from 'react';
import ApiUtils from '../../utils/ApiUtils';
import './MealRecommendations.css';

const MealRecommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="loading">טוען המלצות חכמות...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="meal-recommendation-container">
      <h1>🍽️ המלצות חכמות לארוחה</h1>

      <h2 className="meal-type">🍴 {data.mealType}</h2>

      <div className="recommendations-grid">
        {data.recommendations.map((meal, index) => (
          <div key={index} className="recommendation-card">
            <h3>{meal.name}</h3>

            <p className="description">{meal.description}</p>

            <div className="calories">
              🔥 {meal.estimatedCalories} קלוריות
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealRecommendations;
