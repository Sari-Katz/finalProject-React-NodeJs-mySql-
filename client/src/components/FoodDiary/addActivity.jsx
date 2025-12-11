import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddActivity.css';

const AddActivity = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State for this component
    const [remainingCalories, setRemainingCalories] = useState(0);
    const [todaysClasses, setTodaysClasses] = useState([]);
    const [workoutInput, setWorkoutInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [burnedCalories, setBurnedCalories] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // In a real app, you'd fetch this data from your backend
        const fetchData = async () => {
            // 1. Fetch remaining calories
            // const calorieStatus = await api.get('/api/food-diary/today');
            // setRemainingCalories(calorieStatus.data.daily_calorie_goal - calorieStatus.data.consumed_calories);
            
            // 2. Fetch today's classes
            // const classesResponse = await api.get('/api/classes/today');
            // setTodaysClasses(classesResponse.data);

            // Mock data for now
            const mockRemaining = 2200 - 850 - (location.state?.addedCalories || 450);
            setRemainingCalories(mockRemaining);
            setTodaysClasses([
                { id: 1, title: 'יוגה ויניאסה', start_time: '18:00' },
                { id: 2, title: 'אימון HIIT', start_time: '19:00' },
            ]);
        };

        fetchData();
    }, [location.state]);

    const handleAnalyzeWorkout = async () => {
        if (!workoutInput) {
            setError('יש לתאר את הפעילות שביצעת.');
            return;
        }
        setIsAnalyzing(true);
        setError('');
        setBurnedCalories(null);

        try {
            // TODO: Replace with actual API call to Gemini via your backend
            // const response = await api.post('/api/food-diary/analyze-workout', { description: workoutInput });
            // const burned = response.data.burnedCalories;

            console.log(`Analyzing workout: ${workoutInput}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI analysis
            const burned = Math.floor(Math.random() * (350 - 150 + 1)) + 150; // Simulate result

            setBurnedCalories(burned);
            setRemainingCalories(prev => prev + burned); // Add to remaining calories

        } catch (err) {
            setError('שגיאה בניתוח הפעילות. נסי שוב.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
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
                        🎉 כל הכבוד! שרפת כ-<strong>{burnedCalories}</strong> קלוריות, שהתווספו למאזן היומי שלך.
                    </div>
                )}
            </div>

            <div className="suggestions-card">
                <h3>הצעות לאימון להיום</h3>
                <ul>
                    {todaysClasses.map(cls => (
                        <li key={cls.id}>
                            <span className="class-tag">שיעור במערכת</span>
                            <strong>{cls.title}</strong> בשעה {cls.start_time}
                        </li>
                    ))}
                    <li>
                        <span className="idea-tag">רעיון</span>
                        30 דקות הליכה מהירה בפארק
                    </li>
                </ul>
            </div>

            <button className="back-to-dash-btn" onClick={() => navigate('/food-diary')}>
                חזרה למסך הראשי
            </button>
        </div>
    );
};

export default AddActivity;

