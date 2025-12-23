import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddActivity.module.css';
import ApiUtils from '../../utils/ApiUtils';

const AddActivity = () => {
    const navigate = useNavigate();

    // Calories status
    const [remainingCalories, setRemainingCalories] = useState(0);

    // Studio classes
    const [studioClasses, setStudioClasses] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);

    // Activity logging
    const [workoutInput, setWorkoutInput] = useState('');
    const [burnedCalories, setBurnedCalories] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Calories status
                const status = await ApiUtils.get(
                    `${import.meta.env.VITE_API_URL}/food-diary/today`
                );
                const remaining =
                    status.daily_calorie_goal -
                    status.consumed_calories +
                    status.burned_calories;

                setRemainingCalories(remaining);

                // Studio classes
                const classesResponse = await ApiUtils.get(
                    `${import.meta.env.VITE_API_URL}/classes/today`
                );
                setStudioClasses(classesResponse);
            } catch (err) {
                console.error(err);
                setError('שגיאה בטעינת הנתונים');
            } finally {
                setIsLoadingClasses(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleAnalyzeWorkout = async () => {
        if (!workoutInput) {
            setError('יש לתאר את הפעילות שביצעת');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        setBurnedCalories(null);

        try {
            const response = await ApiUtils.post(
                `${import.meta.env.VITE_API_URL}/food-diary/analyze-activity`,
                { description: workoutInput }
            );
            setBurnedCalories(response.burnedCalories);
        } catch (err) {
            setError('שגיאה בניתוח הפעילות');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLogActivity = async (calories) => {
        if (!calories || calories <= 0) return;

        setIsLogging(true);
        setError('');

        try {
            await ApiUtils.post(
                `${import.meta.env.VITE_API_URL}/food-diary/log-activity`,
                { burned_calories: calories }
            );
            navigate('/calorie-dashboard', { replace: true });
        } catch (err) {
            setError('שגיאה בתיעוד הפעילות');
        } finally {
            setIsLogging(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
            >
                ← חזרה
            </button>

            {/* Status Card */}
            <div className={styles.statusCard}>
                <p className={styles.statusText}>נשארו לך עוד</p>
                <div className={styles.caloriesHighlight}>
                    {remainingCalories}
                </div>
                <p className={styles.statusSubtext}>קלוריות להיום</p>
            </div>

            {/* Studio Classes */}
            <div className={styles.studioSection}>
                   <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>🏋️‍♀️</span>
                    שיעורי הסטודיו שלנו היום
                </h3>
              
                

                {isLoadingClasses ? (
                    <p className={styles.loadingText}>טוען שיעורים...</p>
                ) : studioClasses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>😔</div>
                        <p>אין שיעורים מתוכננים להיום</p>
                    </div>
                ) : (
                    <div className={styles.classesGrid}>
                        {studioClasses.map((item) => (
                            <div
                                key={item.id}
                                className={styles.classCard}
                                onClick={() =>
                                    handleLogActivity(
                                        item.estimatedCalories || 200
                                    )
                                }
                            >
                                <div className={styles.classIcon}>🏋️‍♀️</div>

                                <h4 className={styles.className}>
                                    {item.title}
                                </h4>

                                <p className={styles.classType}>
                                    {item.class_types}
                                </p>

                                <p className={styles.classTime}>
                                    🕒 {item.start_time?.slice(0, 5)}
                                </p>

                                <div className={styles.classCalories}>
                                    🔥 ~{item.estimatedCalories || 200} קלוריות
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                  <p className={styles.sectionSubtitle}>
                    השתתפת באחד השיעורים? תעדי אותו ותרוויחי קלוריות!
                </p>
            </div>

            {/* Custom Activity */}
            <div className={styles.workoutCard}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>✍️</span>
                    פעילות מותאמת אישית
                </h3>

                <textarea
                    className={styles.textarea}
                    placeholder="לדוגמה: 30 דקות ריצה קלה"
                    value={workoutInput}
                    onChange={(e) => setWorkoutInput(e.target.value)}
                />

                <button
                    className={styles.analyzeBtn}
                    onClick={handleAnalyzeWorkout}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? 'מחשב...' : 'חשב קלוריות'}
                </button>

                {burnedCalories !== null && (
                    <div className={styles.burnResult}>
                        <p>שרפת כ־</p>
                        <div className={styles.resultCalories}>
                            {burnedCalories}
                        </div>
                        <p>קלוריות</p>

                        <button
                            className={styles.logBtn}
                            onClick={() =>
                                handleLogActivity(burnedCalories)
                            }
                            disabled={isLogging}
                        >
                            תעדי פעילות
                        </button>
                    </div>
                )}

                {error && (
                    <p className={styles.errorMessage}>{error}</p>
                )}
            </div>

            <button
                className={styles.dashBtn}
                onClick={() => navigate('/calorie-dashboard')}
            >
                חזרה למסך הראשי
            </button>
        </div>
    );
};

export default AddActivity;
