import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MealAnalysisResult.css';
import ApiUtils from '../../utils/ApiUtils';

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
                <button onClick={() => navigate('/calorie-dashboard/add-meal')}>חזרה להעלאת תמונה</button>
            </div>
        );
    }

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Call the backend to log the calories
            await ApiUtils.post(`${import.meta.env.VITE_API_URL

}/food-diary/log`, {
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
        navigate('/calorie-dashboard'); // Go back to the dashboard
    };

    return (
        <div className="result-container">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
                aria-label="חזרה אחורה"
            >
                ← חזרה
            </button>
            <h2>תוצאות ניתוח ה-AI</h2>
            <div className="analysis-card">
                <h3>ה-AI זיהה את הפריטים הבאים:</h3>
                <ul className="food-items-list">
                    {analysis.foodItems.map((item, index) => (
                        <li key={index} className="food-item">
                            <div className="food-amount">{item.amount}</div>
                            <div className="food-name">{item.name}</div>
                            {item.calories && (
                                <div className="food-calories">{item.calories} קלוריות</div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="calories-estimation">
                    <p>הערכה קלורית כוללת:</p>
                    <span>{analysis.estimatedCalories}</span>
                    <p>קלוריות</p>
                </div>
                <div className="calories-estimation">
                    <p>אם תאכל את המנה ישארו לך:</p>
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