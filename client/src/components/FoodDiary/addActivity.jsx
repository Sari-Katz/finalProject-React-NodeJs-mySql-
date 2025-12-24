import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddActivity.module.css';
import ApiUtils from '../../utils/ApiUtils';

const AddActivity = () => {
    const navigate = useNavigate();

    const [remainingCalories, setRemainingCalories] = useState(0);
    const [workoutInput, setWorkoutInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [burnedCalories, setBurnedCalories] = useState(null);
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);

    // Studio classes
    const [studioClasses, setStudioClasses] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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

                // Studio classes – נטען אוטומטית
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
            const response = await ApiUtils.post(
                `${import.meta.env.VITE_API_URL}/food-diary/analyze-activity`,
                { description: workoutInput }
            );
            setBurnedCalories(response.burnedCalories);
        } catch (err) {
            setError('שגיאה בניתוח הפעילות.');
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
            setError('שגיאה בתיעוד הפעילות.');
        } finally {
            setIsLogging(false);
        }
    };

    const handleSelectStudioClass = (studioClass) => {
        handleLogActivity(studioClass.estimatedCalories || 200);
    };

    const quickActivities = [
        { name: 'הליכה 30 דקות', icon: '🚶‍♀️', calories: 150 },
        { name: 'ריצה 20 דקות', icon: '🏃‍♀️', calories: 200 },
        { name: 'שחייה 30 דקות', icon: '🏊‍♀️', calories: 250 },
        { name: 'רכיבה על אופניים', icon: '🚴‍♀️', calories: 220 },
        { name: 'אימון כוח', icon: '💪', calories: 180 }
    ];

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
            >
                ← חזרה
            </button>

                        {/* Studio Classes */}
            <div className={styles.studioSection}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>🏋️‍♀️</span>
                    שיעורי הסטודיו שלנו היום
                </h3>

                {isLoadingClasses ? (
                    <p>טוען שיעורים...</p>
                ) : studioClasses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>😔</div>
                        <p>אין שיעורים מתוכננים להיום</p>
                    </div>
                ) : (
                    <div className={styles.classesGrid}>
                        {studioClasses.map((classItem) => (
                            <div
                                key={classItem.id}
                                className={styles.classCard}
                                onClick={() =>
                                    handleSelectStudioClass(classItem)
                                }
                            >
                                <div className={styles.classIcon}>🏋️‍♀️</div>

                                <h4 className={styles.className}>
                                    {classItem.title}
                                </h4>

                                <p className={styles.classTime}>
                                    🕒 {classItem.start_time?.slice(0, 5)}
                                </p>

                                <div className={styles.classCalories}>
                                    🔥 ~{classItem.estimatedCalories || 200}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                  <p className={styles.sectionSubtitle}>
                    השתתפת באחד השיעורים? תעדי אותו ותרוויחי קלוריות!
                </p>
            </div>

            {/* Custom Workout */}
            <div className={styles.workoutCard}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>✍️</span>
                    תארי פעילות מותאמת אישית
                </h3>

                <textarea
                    className={styles.textarea}
                    value={workoutInput}
                    onChange={(e) => setWorkoutInput(e.target.value)}
                    rows="4"
                />

                <button
                    onClick={handleAnalyzeWorkout}
                    disabled={isAnalyzing}
                    className={styles.analyzeBtn}
                >
                    {isAnalyzing ? 'מחשב...' : 'חשב קלוריות'}
                </button>

                {burnedCalories !== null && (
                    <div className={styles.burnResult}>
                        <div className={styles.resultCalories}>
                            {burnedCalories}
                        </div>

                        <button
                            onClick={() =>
                                handleLogActivity(burnedCalories)
                            }
                            disabled={isLogging}
                            className={styles.logBtn}
                        >
                            תעדי פעילות ביומן
                        </button>
                    </div>
                )}

                {error && (
                    <p className={styles.errorMessage}>{error}</p>
                )}
            </div>

            {/* Quick Activities – נשאר כמו שהיה */}
            <div className={styles.quickSection}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>⚡</span>
                    פעילויות מהירות
                </h3>

                <div className={styles.quickGrid}>
                    {quickActivities.map((activity, index) => (
                        <button
                            key={index}
                            className={styles.quickCard}
                            onClick={() =>
                                handleLogActivity(activity.calories)
                            }
                            disabled={isLogging}
                        >
                            <div className={styles.quickIcon}>
                                {activity.icon}
                            </div>
                            <div className={styles.quickName}>
                                {activity.name}
                            </div>
                            <div className={styles.quickCalories}>
                                🔥 {activity.calories}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

              </div>
    );
};

export default AddActivity;
