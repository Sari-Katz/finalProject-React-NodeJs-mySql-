import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MealAnalysisResult.css';

const MealAnalysisResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get analysis data passed from the previous page
    const { analysis } = location.state || {};

    if (!analysis) {
        return (
            <div className="result-container">
                <h2>שגיאה</h2>
                <p>לא נמצאו נתוני ניתוח. אנא חזרי אחורה ונסה שוב.</p>
                <button onClick={() => navigate('/add-meal')}>חזרה להעלאת תמונה</button>
            </div>
        );
    }

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            // TODO: Replace with actual API call to log the calories
            // This endpoint will update the daily_calorie_tracking table
            // await api.post('/api/food-diary/log', { calories: analysis.estimatedCalories });

            console.log(`Confirming meal with ${analysis.estimatedCalories} calories.`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // Redirect to the dashboard to see the updated progress
            navigate('/add-activity', { replace: true });

        } catch (err) {
            setError('שגיאה ברישום הארוחה. נסי שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/calories-dashboard'); // Go back to the dashboard
    };

    return (
        <div className="result-container">
            <h2>תוצאות ניתוח ה-AI</h2>
            <div className="analysis-card">
                <h3>ה-AI זיהה את הפריטים הבאים:</h3>
                <ul>
                    {analysis.foodItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <div className="calories-estimation">
                    <p>הערכה קלורית כוללת:</p>
                    <span>{analysis.estimatedCalories}</span>
                    <p>קלוריות</p>
                </div>
            </div>

            <div className="confirmation-prompt">
                <h3>האם לתעד את הארוחה הזו ביומן שלך?</h3>
                {error && <p className="error-message">{error}</p>}
                <div className="confirmation-buttons">
                    <button onClick={handleCancel} className="btn-cancel" disabled={isLoading}>ביטול</button>
                    <button onClick={handleConfirm} className="btn-confirm" disabled={isLoading}>
                        {isLoading ? 'מתעד...' : 'כן, תעד ארוחה'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealAnalysisResult;