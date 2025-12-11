import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalorieGoalSetup.css';

const CalorieGoalSetup = () => {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'female',
        activityLevel: 'sedentary'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
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
        const { age, weight, height, activityLevel } = formData;
        if (!age || !weight || !height) {
            setError('יש למלא את כל השדות.');
            return;
        }

        setIsLoading(true);
        setError('');

        const bmr = calculateBMR();
        const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

        try {
            // TODO: Replace with actual API call to update user's daily_calorie_goal
            // await api.put('/api/user/profile', { daily_calorie_goal: tdee });

            console.log(`Calculated TDEE (daily goal): ${tdee}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // After successful update, redirect to the main diary page
            navigate('/food-diary', { replace: true });

        } catch (err) {
            setError('שגיאה בעדכון יעד הקלוריות. נסו שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="setup-container">
            <h2>הגדרת יעד קלורי יומי</h2>
            <p>כדי שנוכל לעזור לך, נצטרך כמה פרטים לחישוב יעד הקלוריות המומלץ עבורך.</p>
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
                <div className="form-group">
                    <label>רמת פעילות</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                        <option value="sedentary">מעט מאוד (עבודה משרדית)</option>
                        <option value="light">פעילות קלה (1-3 אימונים בשבוע)</option>
                        <option value="moderate">פעילות בינונית (3-5 אימונים בשבוע)</option>
                        <option value="active">פעילות גבוהה (6-7 אימונים בשבוע)</option>
                        <option value="veryActive">פעילות גבוהה מאוד (עבודה פיזית/אימונים כפולים)</option>
                    </select>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isLoading} className="submit-btn">
                    {isLoading ? 'מחשב...' : 'חשב וקבע יעד'}
                </button>
            </form>
        </div>
    );
};

export default CalorieGoalSetup;