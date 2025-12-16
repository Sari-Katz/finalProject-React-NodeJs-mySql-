import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalorieGoalSetup.css';
import ApiUtils from '../../utils/ApiUtils';

const CalorieGoalSetup = () => {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'female',
        activityLevel: 'sedentary',
        goal: 'maintain',
        breastfeeding: 'no'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [calculatedGoal, setCalculatedGoal] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // BMR – Mifflin-St Jeor
    const calculateBMR = () => {
        const { age, weight, height, gender } = formData;
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        }
        return 10 * weight + 6.25 * height - 5 * age - 161;
    };

    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { age, weight, height, activityLevel, goal, breastfeeding, gender } = formData;

        // ✅ ולידציות
        if (!age || !weight || !height) {
            setError('יש למלא את כל השדות.');
            setIsLoading(false);
            return;
        }

        if (age <= 0 || age > 120) {
            setError('גיל חייב להיות בין 1 ל־120.');
            setIsLoading(false);
            return;
        }

        if (weight <= 0 || weight > 500) {
            setError('משקל חייב להיות מספר חיובי והגיוני.');
            setIsLoading(false);
            return;
        }

        if (height <= 0 || height > 250) {
            setError('גובה חייב להיות בין 1 ל־250 ס"מ.');
            setIsLoading(false);
            return;
        }

        if (breastfeeding === 'yes' && gender !== 'female') {
            setError('אפשרות הנקה זמינה לנשים בלבד.');
            setIsLoading(false);
            return;
        }

        const bmr = calculateBMR();
        let tdee = Math.round(bmr * activityMultipliers[activityLevel]);

        // 🎯 התאמת מטרה
        if (goal === 'lose') tdee -= 400;
        if (goal === 'gain') tdee += 300;

        // 👶 הנקה
        if (breastfeeding === 'yes' && gender === 'female') {
            tdee += 450;
        }

        // 🚨 מניעת ערכים קיצוניים
        if (tdee < 1000 || tdee > 4500) {
            setError('היעד הקלורי שחושב אינו הגיוני. בדקי את הנתונים.');
            setIsLoading(false);
            return;
        }

        setCalculatedGoal(tdee);

        try {
            await ApiUtils.put(`${import.meta.env.VITE_API_URL

}/users/set_calorie_goal`, {
                daily_calorie_goal: tdee
            });
        } catch (err) {
            setError('שגיאה בעדכון יעד הקלוריות. נסי שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const goNext = () => {
        navigate('/calorie-dashboard', { replace: true });
    };

    return (
        <div className="setup-container">
            <h2>הגדרת יעד קלורי יומי</h2>
            <p>מלאי את הפרטים כדי לחשב את כמות הקלוריות היומית המותאמת לך.</p>

            <form onSubmit={handleSubmit} className="setup-form">
                <div className="form-group">
                    <label>גיל</label>
                    <input
                        type="number"
                        name="age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>משקל (ק"ג)</label>
                    <input
                        type="number"
                        name="weight"
                        min="1"
                        max="500"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>גובה (ס"מ)</label>
                    <input
                        type="number"
                        name="height"
                        min="50"
                        max="250"
                        value={formData.height}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>מין</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="female">אישה</option>
                        <option value="male">גבר</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>מטרה</label>
                    <select name="goal" value={formData.goal} onChange={handleChange}>
                        <option value="lose">ירידה במשקל</option>
                        <option value="maintain">שמירה על משקל</option>
                        <option value="gain">עלייה במשקל</option>
                    </select>
                </div>

                {formData.gender === 'female' && (
                    <div className="form-group">
                        <label>האם את מניקה?</label>
                        <select
                            name="breastfeeding"
                            value={formData.breastfeeding}
                            onChange={handleChange}
                        >
                            <option value="no">לא</option>
                            <option value="yes">כן</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>רמת פעילות</label>
                    <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                    >
                        <option value="sedentary">מעט מאוד</option>
                        <option value="light">קלה (1–3 אימונים)</option>
                        <option value="moderate">בינונית (3–5 אימונים)</option>
                        <option value="active">גבוהה</option>
                        <option value="veryActive">גבוהה מאוד</option>
                    </select>
                </div>

                {error && <p className="error-message">{error}</p>}

                {calculatedGoal && (
                    <div className="result-box">
                        <h3>היעד היומי שלך:</h3>
                        <p className="goal-number">{calculatedGoal} קלוריות ליום</p>
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="submit-btn">
                    {isLoading ? 'מחשב...' : 'חשב יעד'}
                </button>
            </form>

            <button onClick={goNext} className="continue-btn">
                המשיכי ליומן האכילה
            </button>
        </div>
    );
};

export default CalorieGoalSetup;
