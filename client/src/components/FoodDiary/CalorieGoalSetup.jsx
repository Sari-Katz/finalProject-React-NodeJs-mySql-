import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CalorieGoalSetup.module.css';
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
            await ApiUtils.put(`${import.meta.env.VITE_API_URL}/users/set_calorie_goal`, {
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
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerIcon}>🎯</div>
                    <h2 className={styles.mainTitle}>הגדרת יעד קלורי יומי</h2>
                    <p className={styles.subtitle}>מלאי את הפרטים כדי לחשב את כמות הקלוריות היומית המותאמת לך</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.setupForm}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>גיל</label>
                            <input
                                type="number"
                                name="age"
                                min="1"
                                max="120"
                                value={formData.age}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="הכניסי את הגיל שלך"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>משקל (ק"ג)</label>
                            <input
                                type="number"
                                name="weight"
                                min="1"
                                max="500"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="המשקל שלך"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>גובה (ס"מ)</label>
                            <input
                                type="number"
                                name="height"
                                min="50"
                                max="250"
                                value={formData.height}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="הגובה שלך"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>מין</label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="female">אישה</option>
                                <option value="male">גבר</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>מטרה</label>
                        <select 
                            name="goal" 
                            value={formData.goal} 
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="lose">ירידה במשקל</option>
                            <option value="maintain">שמירה על משקל</option>
                            <option value="gain">עלייה במשקל</option>
                        </select>
                    </div>

                    {formData.gender === 'female' && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>האם את מניקה?</label>
                            <select
                                name="breastfeeding"
                                value={formData.breastfeeding}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="no">לא</option>
                                <option value="yes">כן</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>רמת פעילות</label>
                        <select
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="sedentary">מעט מאוד</option>
                            <option value="light">קלה (1–3 אימונים)</option>
                            <option value="moderate">בינונית (3–5 אימונים)</option>
                            <option value="active">גבוהה</option>
                            <option value="veryActive">גבוהה מאוד</option>
                        </select>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    {calculatedGoal && (
                        <div className={styles.resultBox}>
                            <div className={styles.resultIcon}>✨</div>
                            <h3 className={styles.resultTitle}>היעד היומי שלך:</h3>
                            <p className={styles.goalNumber}>{calculatedGoal}</p>
                            <p className={styles.goalLabel}>קלוריות ליום</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className={styles.submitBtn}
                    >
                        {isLoading ? 'מחשב...' : 'חשב יעד'}
                    </button>
                </form>

                <button 
                    onClick={goNext} 
                    className={styles.continueBtn}
                    disabled={!calculatedGoal}
                >
                    המשיכי ליומן האכילה →
                </button>
            </div>
        </div>
    );
};

export default CalorieGoalSetup;