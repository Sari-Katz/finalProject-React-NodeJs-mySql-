import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddActivity.css';
import ApiUtils from '../../utils/ApiUtils';

const AddActivity = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State for this component
    const [remainingCalories, setRemainingCalories] = useState(0);
    const [workoutInput, setWorkoutInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [burnedCalories, setBurnedCalories] = useState(null);
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current calorie status
                const status = await ApiUtils.get(`${import.meta.env.VITE_API_URL

}/food-diary/today`);
                const remaining = status.daily_calorie_goal - status.consumed_calories + status.burned_calories;
                setRemainingCalories(remaining);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                setError("שגיאה בטעינת הנתונים.");
            }
        };

        fetchData();
    }, []);

    const handleAnalyzeWorkout = async () => {
        if (!workoutInput) {
            setError('יש לתאר את הפעילות שביצעת.');
            return;
        }
        setIsAnalyzing(true);
        setError('');
        setBurnedCalories(null);

        try {
            const response = await ApiUtils.post(`${import.meta.env.VITE_API_URL

}/food-diary/analyze-activity`, { description: workoutInput });
            const burned = response.burnedCalories;
            setBurnedCalories(burned);
        } catch (err) {
            setError('שגיאה בניתוח הפעילות. נסי שוב.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLogActivity = async () => {
        if (burnedCalories === null || burnedCalories <= 0) return;

        setIsLogging(true);
        setError('');
        try {
            await ApiUtils.post(`${import.meta.env.VITE_API_URL

}/food-diary/log-activity`, { burned_calories: burnedCalories });
            // Navigate to dashboard after successful logging
            navigate('/calorie-dashboard', { replace: true });
        } catch (err) {
            setError('שגיאה בתיעוד הפעילות. נסי שוב.');
            console.error(err);
        } finally {
            setIsLogging(false);
        }
    };

    return (
        <div className="post-meal-container">
            <div className="status-card">
                <h2>מעולה, הארוחה תועדה!</h2>
                <p>נשארו לך עוד</p>
                <span className="calories-highlight">{remainingCalories}</span>
                <p>קלוריות להיום.</p>
            </div>

            <div className="workout-card">
                <h3>רוצה "להרוויח" עוד קלוריות?</h3>
                <p>תארי פעילות גופנית שביצעת, וה-AI יחשב כמה קלוריות שרפת.</p>
                <textarea
                    placeholder="לדוגמה: 30 דקות ריצה קלה, או אימון כוח בחדר כושר"
                    value={workoutInput}
                    onChange={(e) => setWorkoutInput(e.target.value)}
                />
                <button onClick={handleAnalyzeWorkout} disabled={isAnalyzing}>
                    {isAnalyzing ? 'מחשב...' : 'חשב קלוריות שנשרפו'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {burnedCalories !== null && (
                    <div className="burn-result">
                        🎉 כל הכבוד! הערכה היא ששרפת כ-<strong>{burnedCalories}</strong> קלוריות.
                        <button onClick={handleLogActivity} disabled={isLogging} className="log-activity-btn">
                            {isLogging ? 'מתעד...' : 'תעד פעילות ביומן'}
                        </button>
                    </div>
                )}
            </div>

            <button className="back-to-dash-btn" onClick={() => navigate('/calorie-dashboard')}>
                חזרה למסך הראשי
            </button>
        </div>
    );
};

export default AddActivity;
