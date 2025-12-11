import React, { useState, useEffect } from 'react';
import CalorieGoalSetup from './CalorieGoalSetup';
import MealAnalysisResult from './MealAnalysisResult';

import { useNavigate, Navigate } from 'react-router-dom';
import './CalorieDashboard.css'; // ניצור קובץ CSS בסיסי לעיצוב

const CalorieDashboard = () => {
    const [dailyGoal, setDailyGoal] = useState(null); // Start with null to indicate loading/not set
    const [consumed, setConsumed] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // In a real app, you would fetch this data from your backend
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            // TODO: Replace with actual API call
            // Example: const response = await api.get('/api/food-diary/today');
            // const data = response.data;
            // setDailyGoal(data.daily_calorie_goal);
            // setConsumed(data.consumed_calories);

            // Simulate fetching user data.
            // A value of 0 or null for dailyGoal means it's not set.
            const fetchedGoal = 2200; // Simulate a set goal. Change to 0 to test the redirect.
            
            setDailyGoal(fetchedGoal); 
            setConsumed(850); 
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div>טוען נתונים...</div>; // Or a spinner component
    }

    // If goal is not set (e.g., 0 or null), redirect to setup page
    if (!dailyGoal) {
        return <Navigate to="/calorie-setup" replace />;
    }

    const remainingCalories = dailyGoal - consumed;
    const progressPercentage = dailyGoal > 0 ? (consumed / dailyGoal) * 100 : 0;

    const handleAddMeal = () => {
        navigate('/add-meal'); // ננווט לעמוד העלאת התמונה
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
                    <span>נותרו: <strong>{remainingCalories}</strong></span>
                    <span>מטרה: <strong>{dailyGoal}</strong></span>
                </div>
            </div>

            <div className="actions">
                <button onClick={handleAddMeal} className="add-meal-btn">
                    📸 הוסף ארוחה חדשה
                </button>
            </div>
        </div>
    );
};

export default CalorieDashboard;