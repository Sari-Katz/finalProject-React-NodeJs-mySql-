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
        goal: 'maintain',            // NEW: ירידה / שמירה / עליה
        breastfeeding: 'no'          // NEW: מניקה?
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [calculatedGoal, setCalculatedGoal] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // BMR Calculation using Mifflin-St Jeor formula
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
        const { age, weight, height, activityLevel, goal, breastfeeding } = formData;

        if (!age || !weight || !height) {
            setError('יש למלא את כל השדות.');
            return;
        }

        setIsLoading(true);
        setError('');

        const bmr = calculateBMR();
        let tdee = Math.round(bmr * activityMultipliers[activityLevel]);

        // 🎯 NEW: התאמת TDEE לפי המטרה
        if (goal === 'lose') tdee -= 400;        // ירידה במשקל
        else if (goal === 'gain') tdee += 300;  // עליה במשקל

        // 👶 NEW: התאמת TDEE לאישה מניקה
        if (breastfeeding === 'yes' && formData.gender === 'female') {
            tdee += 450;
        }

        // שומרים להצגה למשתמש
        setCalculatedGoal(tdee);

        try {
            await ApiUtils.put('http://localhost:3000/users/set_calorie_goal', { daily_calorie_goal: tdee });
        } catch (err) {
            setError('שגיאה בעדכון יעד הקלוריות. נסו שוב.');
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
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>משקל (ק"ג)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>גובה (ס"מ)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>מין</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="female">אישה</option>
                        <option value="male">גבר</option>
                    </select>
                </div>

                {/* ✔ NEW: בחירת מטרה */}
                <div className="form-group">
                    <label>מטרה</label>
                    <select name="goal" value={formData.goal} onChange={handleChange}>
                        <option value="lose">לרדת במשקל</option>
                        <option value="maintain">להישאר באותו משקל</option>
                        <option value="gain">לעלות במשקל</option>
                    </select>
                </div>

                {/* ✔ NEW: האם מניקה */}
                {formData.gender === 'female' && (
                    <div className="form-group">
                        <label>האם את מניקה?</label>
                        <select name="breastfeeding" value={formData.breastfeeding} onChange={handleChange}>
                            <option value="no">לא</option>
                            <option value="yes">כן</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>רמת פעילות</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                        <option value="sedentary">מעט מאוד (עבודה משרדית)</option>
                        <option value="light">פעילות קלה (1–3 אימונים בשבוע)</option>
                        <option value="moderate">פעילות בינונית (3–5 אימונים בשבוע)</option>
                        <option value="active">פעילות גבוהה (6–7 אימונים בשבוע)</option>
                        <option value="veryActive">פעילות גבוהה מאוד</option>
                    </select>
                </div>

                {error && <p className="error-message">{error}</p>}
               {/* ✔ NEW: הצגת התוצאה לפני מעבר עמוד */}
            {calculatedGoal && (
                <div className="result-box">
                    <h3>היעד היומי שלך הוא:</h3>
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
