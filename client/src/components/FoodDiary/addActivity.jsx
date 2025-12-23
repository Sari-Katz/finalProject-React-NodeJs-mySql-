import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddActivity.module.css';
import ApiUtils from '../../utils/ApiUtils';

const AddActivity = () => {
    const navigate = useNavigate();

    // State for this component
    const [remainingCalories, setRemainingCalories] = useState(0);
    const [workoutInput, setWorkoutInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [burnedCalories, setBurnedCalories] = useState(null);
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    
    // State for studio classes
    const [studioClasses, setStudioClasses] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [showStudioClasses, setShowStudioClasses] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current calorie status
                const status = await ApiUtils.get(
                    `${import.meta.env.VITE_API_URL}/food-diary/today`
                );
                const remaining = status.daily_calorie_goal - status.consumed_calories + status.burned_calories;
                setRemainingCalories(remaining);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                setError("שגיאה בטעינת הנתונים.");
            }
        };

        fetchData();
    }, []);

    // Fetch studio classes
    const fetchStudioClasses = async () => {
        setIsLoadingClasses(true);
        setError('');
        try {
            const response = await ApiUtils.get(
                `${import.meta.env.VITE_API_URL}/classes/today`
            );
            setStudioClasses(response.classes || []);
            setShowStudioClasses(true);
        } catch (err) {
            setError('שגיאה בטעינת שיעורי הסטודיו. נסי שוב.');
            console.error(err);
        } finally {
            setIsLoadingClasses(false);
        }
    };

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
            const burned = response.burnedCalories;
            setBurnedCalories(burned);
        } catch (err) {
            setError('שגיאה בניתוח הפעילות. נסי שוב.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLogActivity = async (calories = burnedCalories) => {
        if (calories === null || calories <= 0) return;

        setIsLogging(true);
        setError('');
        try {
            await ApiUtils.post(
                `${import.meta.env.VITE_API_URL}/food-diary/log-activity`,
                { burned_calories: calories }
            );
            // Navigate to dashboard after successful logging
            navigate('/calorie-dashboard', { replace: true });
        } catch (err) {
            setError('שגיאה בתיעוד הפעילות. נסי שוב.');
            console.error(err);
        } finally {
            setIsLogging(false);
        }
    };

    const handleSelectStudioClass = (studioClass) => {
        setSelectedClass(studioClass);
        handleLogActivity(studioClass.estimatedCalories);
    };

    // Quick activity presets
    const quickActivities = [
        { name: 'הליכה 30 דקות', icon: '🚶‍♀️', calories: 150 },
        { name: 'ריצה 20 דקות', icon: '🏃‍♀️', calories: 200 },
        { name: 'יוגה 45 דקות', icon: '🧘‍♀️', calories: 180 },
        { name: 'שחייה 30 דקות', icon: '🏊‍♀️', calories: 250 },
        { name: 'רכיבה על אופניים', icon: '🚴‍♀️', calories: 220 },
    ];

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
                aria-label="חזרה אחורה"
            >
                ← חזרה
            </button>

            {/* Status Card */}
            <div className={styles.statusCard}>
                <div className={styles.statusIcon}>🎉</div>
                <h2 className={styles.statusTitle}>מעולה!</h2>
                <p className={styles.statusText}>נשארו לך עוד</p>
                <div className={styles.caloriesHighlight}>{remainingCalories}</div>
                <p className={styles.statusSubtext}>קלוריות להיום</p>
            </div>

            {/* Studio Classes Section */}
            <div className={styles.studioSection}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>🏋️‍♀️</span>
                    שיעורי הסטודיו שלנו היום
                </h3>
                <p className={styles.sectionSubtitle}>
                    השתתפת באחד השיעורים? תעדי אותו ותרוויחי קלוריות!
                </p>
                
                {!showStudioClasses ? (
                    <button 
                        onClick={fetchStudioClasses} 
                        className={styles.studioBtn}
                        disabled={isLoadingClasses}
                    >
                        {isLoadingClasses ? (
                            <>
                                <span className={styles.spinner}></span>
                                טוען שיעורים...
                            </>
                        ) : (
                            <>
                                <span className={styles.btnIcon}>📅</span>
                                הצגי את שיעורי היום
                            </>
                        )}
                    </button>
                ) : (
                    <div className={styles.classesGrid}>
                        {studioClasses.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>😔</div>
                                <p>אין שיעורים מתוכננים להיום</p>
                            </div>
                        ) : (
                            studioClasses.map((classItem, index) => (
                                <div 
                                    key={index} 
                                    className={styles.classCard}
                                    onClick={() => handleSelectStudioClass(classItem)}
                                >
                                    <div className={styles.classIcon}>
                                        {classItem.icon || '🏋️'}
                                    </div>
                                    <h4 className={styles.className}>{classItem.name}</h4>
                                    <p className={styles.classTime}>{classItem.time}</p>
                                    <div className={styles.classCalories}>
                                        🔥 ~{classItem.estimatedCalories} קלוריות
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>



            {/* Custom Workout Input */}
            <div className={styles.workoutCard}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>✍️</span>
                    תארי פעילות מותאמת אישית
                </h3>
                <p className={styles.sectionSubtitle}>
                    ה-AI שלנו יחשב כמה קלוריות שרפת
                </p>
                
                <textarea
                    className={styles.textarea}
                    placeholder="לדוגמה: 30 דקות ריצה קלה בפארק, או אימון כוח בחדר כושר עם משקולות"
                    value={workoutInput}
                    onChange={(e) => setWorkoutInput(e.target.value)}
                    rows="4"
                />
                
                <button 
                    onClick={handleAnalyzeWorkout} 
                    disabled={isAnalyzing}
                    className={styles.analyzeBtn}
                >
                    {isAnalyzing ? (
                        <>
                            <span className={styles.spinner}></span>
                            מחשב...
                        </>
                    ) : (
                        <>
                            <span className={styles.btnIcon}>🤖</span>
                            חשב קלוריות שנשרפו
                        </>
                    )}
                </button>

                {error && <p className={styles.errorMessage}>{error}</p>}
            {/* Quick Activities */}
            <div className={styles.quickSection}>
                <h3 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>⚡</span>
                    פעילויות מהירות
                </h3>
                <p className={styles.sectionSubtitle}>
                    בחרי פעילות מהרשימה לתיעוד מהיר
                </p>
                
                <div className={styles.quickGrid}>
                    {quickActivities.map((activity, index) => (
                        <button
                            key={index}
                            className={styles.quickCard}
                            onClick={() => handleLogActivity(activity.calories)}
                            disabled={isLogging}
                        >
                            <div className={styles.quickIcon}>{activity.icon}</div>
                            <div className={styles.quickName}>{activity.name}</div>
                            <div className={styles.quickCalories}>
                                🔥 {activity.calories}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
                {burnedCalories !== null && (
                    <div className={styles.burnResult}>
                        <div className={styles.resultIcon}>🎉</div>
                        <p className={styles.resultText}>
                            כל הכבוד! הערכה היא ששרפת כ-
                        </p>
                        <div className={styles.resultCalories}>{burnedCalories}</div>
                        <p className={styles.resultUnit}>קלוריות</p>
                        
                        <button 
                            onClick={() => handleLogActivity(burnedCalories)} 
                            disabled={isLogging}
                            className={styles.logBtn}
                        >
                            {isLogging ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    מתעד...
                                </>
                            ) : (
                                <>
                                    <span className={styles.btnIcon}>✓</span>
                                    תעדי פעילות ביומן
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Back to Dashboard */}
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