import React, { useState, useEffect } from 'react';
import CalorieGoalSetup from './CalorieGoalSetup';
import ApiUtils from '../../utils/ApiUtils';
import MealAnalysisResult from './MealAnalysisResult';

import { useNavigate, Navigate } from 'react-router-dom';
import './CalorieDashboard.css'; // ניצור קובץ CSS בסיסי לעיצוב

const CalorieDashboard = () => {
    const [dailyGoal, setDailyGoal] = useState(null); // Start with null to indicate loading/not set
    const [consumed, setConsumed] = useState(0);
    const[burned_calories,setBurned_calories]=useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // In a real app, you would fetch this data from your backend
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const data = await ApiUtils.get('http://localhost:3000/food-diary/today');
                console.log("Fetched calorie data:", data);
                setDailyGoal(data.daily_calorie_goal);
                setConsumed(data.consumed_calories);
                setBurned_calories(data.burned_calories);
            } catch (error) {
                console.error("Failed to fetch calorie data", error);
                // Handle error, maybe show a message to the user
                setDailyGoal(0); // Force redirect to setup on error
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div>טוען נתונים...</div>; // Or a spinner component
    }

    // If goal is not set (e.g., 0 or null), redirect to setup page
    if (!dailyGoal) {
        return <Navigate to="/calorie-dashboard/calorie-setup" replace />;
    }

    const remainingCalories = dailyGoal - consumed + burned_calories;
    const progressPercentage = dailyGoal > 0 ? (consumed / dailyGoal) * 100 : 0;

    const handleAddMeal = () => {
        navigate('/calorie-dashboard/add-meal'); // ננווט לעמוד העלאת התמונה
    };
      const handleCaloriesSetup = () => {
        navigate('/calorie-dashboard/calorie-setup'); // ננווט לעמוד הגדרת קלוריות
    };
      const handleAddActivity  = () => {
        navigate('/calorie-dashboard/add-activity'); // ננווט לעמוד העלאת התמונה
    };

    return (
        <div className="food-diary-container">
            <header className="diary-header">
                <h1>יומן התזונה שלי</h1>
                <p>כאן תוכלי לעקוב אחר התזונה שלך בעזרת AI.</p>
            </header>

            <div className="calorie-summary">
                <h2>ההתקדמות היומית שלך</h2>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progressPercentage}%` }}
                    >
                        {Math.round(consumed)} קלוריות
                    </div>
                </div>
                <div className="calorie-details">
                    <span>נצרכו: <strong>{consumed}</strong></span>
                    <span>נשרפו: <strong>{burned_calories}</strong></span>
                    <span>נותרו: <strong>{remainingCalories}</strong></span>
                    <span>מטרה: <strong>{dailyGoal}</strong></span>
                </div>
            </div>

            <div className="actions">
                    <button onClick={handleAddMeal} className="add-meal-btn">
                        📸 הוסף ארוחה חדשה
                    </button>
                    <button onClick={handleCaloriesSetup} className="setup-goal-btn">
                        🎯 הגדר/י יעד קלורי
                    </button>
                    <button onClick={handleAddActivity} className="add-activity-btn">
                        🏃‍♀️ הוסף פעילות גופנית
                    </button>   
            </div>
        </div>
    );
};

export default CalorieDashboard;